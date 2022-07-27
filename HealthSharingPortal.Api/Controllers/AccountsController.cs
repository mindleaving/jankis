using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Commons.Extensions;
using HealthModels;
using HealthModels.AccessControl;
using HealthModels.Interview;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.ViewModels;
using HealthSharingPortal.API.Workflow;
using HealthSharingPortal.API.Workflow.ViewModelBuilders;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Facebook;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.MicrosoftAccount;
using Microsoft.AspNetCore.Authentication.Twitter;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using IAuthenticationModule = HealthSharingPortal.API.AccessControl.IAuthenticationModule;

namespace HealthSharingPortal.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountStore accountsStore;
        private readonly IPersonStore personsStore;
        private readonly IAutocompleteCache autocompleteCache;
        private readonly IAuthenticationModule authenticationModule;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IAuthorizationModule authorizationModule;
        private readonly ILoginStore loginStore;
        private readonly IMenschIdVerifier menschIdVerifier;
        private readonly HealthRecordViewModelBuilder healthRecordViewModelBuilder;
        private readonly AccountDeleterFactory accountDeleterFactory;

        public AccountsController(
            IAccountStore accountsStore,
            IPersonStore personsStore,
            IAuthenticationModule authenticationModule,
            IHttpContextAccessor httpContextAccessor,
            IAuthorizationModule authorizationModule,
            ILoginStore loginStore,
            IMenschIdVerifier menschIdVerifier,
            IAutocompleteCache autocompleteCache,
            HealthRecordViewModelBuilder healthRecordViewModelBuilder,
            AccountDeleterFactory accountDeleterFactory)
        {
            this.accountsStore = accountsStore;
            this.personsStore = personsStore;
            this.authenticationModule = authenticationModule;
            this.httpContextAccessor = httpContextAccessor;
            this.authorizationModule = authorizationModule;
            this.loginStore = loginStore;
            this.menschIdVerifier = menschIdVerifier;
            this.autocompleteCache = autocompleteCache;
            this.healthRecordViewModelBuilder = healthRecordViewModelBuilder;
            this.accountDeleterFactory = accountDeleterFactory;
        }

        [HttpGet]
        [HttpGet("search/{accountType?}")]
        public async Task<IActionResult> Search(
            [FromQuery] string searchText, 
            [FromRoute] AccountType? accountType = null,
            [FromQuery] int? count = null, 
            [FromQuery] int? skip = null,
            [FromQuery] string orderBy = null,
            [FromQuery] OrderDirection orderDirection = OrderDirection.Ascending)
        {
            var currentUserAccountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            // Admins and sharer searching for health professionals can use this API action
            if (currentUserAccountType != AccountType.Admin 
                && !(currentUserAccountType == AccountType.Sharer && accountType == AccountType.HealthProfessional))
            {
                return Forbid();
            }
            Expression<Func<Account, object>> orderByExpression = orderBy?.ToLower() switch
            {
                "id" => x => x.Id,
                "accounttype" => x => x.AccountType,
                "personid" => x => x.PersonId,
                _ => x => x.Id
            };
            var accountFilterExpressions = new List<Expression<Func<Account, bool>>>();
            var searchTerms = SearchTermSplitter.SplitAndToLower(searchText);
            var searchExpression = SearchExpressionBuilder.ContainsAll<Account>(x => x.Id.ToLower(), searchTerms);
            accountFilterExpressions.Add(searchExpression);
            if(accountType.HasValue)
                accountFilterExpressions.Add(x => x.AccountType == accountType.Value);
            var combinedAccountFilter = SearchExpressionBuilder.And(accountFilterExpressions.ToArray());
            var accessGrants = await GetAccessGrants();
            var items = await accountsStore.SearchAsync(
                combinedAccountFilter,
                count, 
                skip,
                orderByExpression,
                orderDirection);
            if (!items.Any())
            {
                var personSearchExpression = SearchExpressionBuilder.Or(
                    SearchExpressionBuilder.ContainsAny<Person>(x => x.FirstName.ToLower(), searchTerms),
                    SearchExpressionBuilder.ContainsAny<Person>(x => x.LastName.ToLower(), searchTerms));
                var matchingPersons = await personsStore.SearchAsync(
                    personSearchExpression,
                    accessGrants);
                if (matchingPersons.Count > 0)
                {
                    var personIds = matchingPersons.Select(person => person.Id).ToList();
                    accountFilterExpressions = new List<Expression<Func<Account, bool>>>
                    {
                        x => personIds.Contains(x.PersonId)
                    };
                    if(accountType.HasValue)
                        accountFilterExpressions.Add(x => x.AccountType == accountType.Value);
                    combinedAccountFilter = SearchExpressionBuilder.And(accountFilterExpressions.ToArray());
                    items = await accountsStore.SearchAsync(combinedAccountFilter, count, skip);
                }
            }
            var viewModels = await BuildAccountViewModels(items, accessGrants);
            return Ok(viewModels);
        }


        [HttpGet("{username}")]
        public async Task<IActionResult> GetByUsername([FromRoute] string username)
        {
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            if (accountType != AccountType.Admin)
                return Forbid();
            var accessGrants = await GetAccessGrants();
            var account = await accountsStore.GetByIdAsync(username);
            if (account == null)
                return NotFound();
            var viewModelFactory = new AccountViewModelBuilder(personsStore);
            var viewModel = await viewModelFactory.Build(account, new AccountViewModelBuilderOptions { AccessGrants = accessGrants });
            return Ok(viewModel);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAccount([FromBody] AccountCreationInfo creationInfo)
        {
            var claims = ControllerHelpers.GetClaims(httpContextAccessor);
            var currentLogin = await loginStore.GetFromClaimsAsync(claims);
            if (currentLogin == null)
                return StatusCode((int)HttpStatusCode.InternalServerError, "Could not determine active login");

            // Create person if not exists
            var personId = creationInfo.Person.Id;
            if(creationInfo.MenschIdChallengeId != null && creationInfo.MenschIdChallengeResponse != null)
                await menschIdVerifier.TryCompleteChallenge(creationInfo.MenschIdChallengeId, creationInfo.MenschIdChallengeResponse);
            if (!await menschIdVerifier.IsControllingId(personId, currentLogin.Id))
                return StatusCode((int)HttpStatusCode.Forbidden, $"You haven't proven that you control the person ID '{personId}'.");

            var existingAccount = await accountsStore.SearchAsync(x => x.AccountType == creationInfo.AccountType && x.PersonId == personId);
            if (existingAccount.Any())
                return Conflict("You already have an account");

            // Create account
            var account = AccountFactory.Create(creationInfo.AccountType, currentLogin.Id, personId);

            // Create person if not exists
            var readAccessGrant = AccessGrantHelpers.GrantForPersonWithPermission(personId, AccessPermissions.Read);
            if (!await personsStore.ExistsAsync(personId, readAccessGrant) 
                || creationInfo.AccountType == AccountType.Sharer)
            {
                creationInfo.Person.Addresses ??= new List<Address>();
                var writeGrant = AccessGrantHelpers.GrantForPersonWithPermission(personId, AccessPermissions.Create);
                var metadata = new PersonDataChangeMetadata(account.Id, personId);
                await personsStore.StoreAsync(creationInfo.Person, writeGrant, metadata);
            }
            foreach (var address in creationInfo.Person.Addresses)
            {
                await autocompleteCache.AddIfNotExists(new AutocompleteCacheItem(AutoCompleteContext.Country.ToString(), address.Country));
            }

            switch (creationInfo.AccountType)
            {
                case AccountType.HealthProfessional:
                    var healthProfessionalAccount = (HealthProfessionalAccount)account;
                    healthProfessionalAccount.WorkAddress = creationInfo.Person.Addresses?.FirstOrDefault();
                    healthProfessionalAccount.PhoneNumber = creationInfo.Person.PhoneNumber;
                    healthProfessionalAccount.Email = creationInfo.Person.Email;
                    break;
                case AccountType.Researcher:
                    var researcherAccount = (ResearcherAccount)account;
                    researcherAccount.WorkAddress = creationInfo.Person.Addresses?.FirstOrDefault();
                    researcherAccount.PhoneNumber = creationInfo.Person.PhoneNumber;
                    researcherAccount.Email = creationInfo.Person.Email;
                    break;
            }

            // Store account
            await accountsStore.StoreAsync(account);

            return Ok(account);
        }


        [AllowAnonymous]
        [HttpPost("{username}/login")]
        public async Task<IActionResult> Login(
            [FromRoute] string username, 
            [FromBody] string password,
            [FromQuery] AccountType accountType)
        {
            if (accountType == AccountType.Undefined)
                return BadRequest($"Invalid account type '{accountType}'");
            var login = await loginStore.GetLocalByUsername(username);
            if(login == null)
                return StatusCode((int)HttpStatusCode.Unauthorized, AuthenticationResult.Failed(AuthenticationErrorType.UserNotFound));
            if (!authenticationModule.Authenticate(login, password))
                return StatusCode((int)HttpStatusCode.Unauthorized, AuthenticationResult.Failed(AuthenticationErrorType.InvalidPassword));
            var account = await accountsStore.FirstOrDefaultAsync(x => x.LoginIds.Contains(login.Id) && x.AccountType == accountType);
            Person person = null;
            if(account != null)
            {
                var readAccessGrant = AccessGrantHelpers.GrantForPersonWithPermission(account.PersonId, AccessPermissions.Read);
                person = await personsStore.GetByIdAsync(account.PersonId, readAccessGrant);
            }
            var authenticationResult = authenticationModule.BuildSecurityTokenForUser(person, account, login);
            return Ok(authenticationResult);
        }

        [Authorize]
        [AllowAnonymous]
        [HttpGet("external-login/{loginProvider}")]
        [HttpPost("external-login/{loginProvider}")]
        public async Task<IActionResult> ExternalLogin(
            [FromRoute] LoginProvider loginProvider,
            [FromQuery] AccountType accountType,
            [FromQuery] string redirectUrl = null)
        {
            if (ControllerHelpers.IsLoggedIn(httpContextAccessor))
            {
                var claims = ControllerHelpers.GetClaims(httpContextAccessor);
                await SetAdditionalClaims(accountType);

                var loginProviderInUse = claims.GetLoginProvider();
                if (loginProvider == loginProviderInUse)
                {
                    if (!string.IsNullOrWhiteSpace(redirectUrl))
                        return Redirect(redirectUrl);
                    return Ok();
                }
            }
            switch (loginProvider)
            {
                case LoginProvider.Google:
                    return Challenge(GoogleDefaults.AuthenticationScheme);
                case LoginProvider.Twitter:
                    return Challenge(TwitterDefaults.AuthenticationScheme);
                case LoginProvider.Facebook:
                    return Challenge(FacebookDefaults.AuthenticationScheme);
                case LoginProvider.Microsoft:
                    return Challenge(MicrosoftAccountDefaults.AuthenticationScheme);
                default:
                    return BadRequest($"Invalid login provider '{loginProvider}'");
            }
        }

        private async Task SetAdditionalClaims(AccountType accountType)
        {
            var claims = httpContextAccessor.HttpContext.User.Claims.ToList();

            var login = await loginStore.GetFromClaimsAsync(claims);
            var accounts = await accountsStore.GetForLoginAsync(login);
            var typedAccount = accounts.FirstOrDefault(x => x.AccountType == accountType);

            var additionalClaims = new List<Claim>();
            if (!claims.Exists(x => x.Type == JwtSecurityTokenBuilder.AccountTypeClaimName))
            {
                additionalClaims.Add(new Claim(JwtSecurityTokenBuilder.AccountTypeClaimName, accountType.ToString()));
            }
            if (!claims.Exists(x => x.Type == JwtSecurityTokenBuilder.AccountIdClaimName))
            {
                if(typedAccount != null)
                    additionalClaims.Add(new Claim(JwtSecurityTokenBuilder.AccountIdClaimName, typedAccount.Id));
            }
            if (!claims.Exists(x => x.Type == JwtSecurityTokenBuilder.PersonIdClaimName))
            {
                if (typedAccount?.PersonId != null)
                {
                    additionalClaims.Add(new Claim(JwtSecurityTokenBuilder.PersonIdClaimName, typedAccount.PersonId));
                }
            }
            if(!additionalClaims.Any())
                return;

            var claimPrincipal = httpContextAccessor.HttpContext.User;
            var claimIdentity = claimPrincipal.Identities.FirstOrDefault();
            if (claimIdentity == null)
            {
                claimIdentity = new ClaimsIdentity();
                claimPrincipal.AddIdentity(claimIdentity);
            }
            claimIdentity.AddClaims(additionalClaims);
            await httpContextAccessor.HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, claimPrincipal);
        }


        [HttpPost("{username}/resetpassword")]
        [Authorize(Policy = AdminRequirement.PolicyName)]
        public async Task<IActionResult> ResetPassword([FromRoute] string username)
        {
            var password = new TemporaryPasswordGenerator().Generate();
            await authenticationModule.ChangePasswordAsync(username, password, true);
            return Ok(password);
        }

        [HttpPost("{username}/changepassword")]
        [Authorize(Policy = SameUserRequirement.PolicyName)]
        public async Task<IActionResult> ChangePassword([FromRoute] string username, [FromBody] string password)
        {
            await authenticationModule.ChangePasswordAsync(username, password);
            return Ok();
        }

        [HttpPost("me/settings/privacy")]
        public async Task<IActionResult> SetPrivacySettings(
            [FromBody] SharerPrivacySettings privacySettings)
        {
            var accountId = ControllerHelpers.GetAccountId(httpContextAccessor);
            if (accountId == null)
                return NotFound();
            var account = await accountsStore.GetByIdAsync(accountId);
            if (account == null)
                return NotFound();
            if(account.AccountType != AccountType.Sharer)
                return BadRequest("Privacy settings can only be set for sharer-accounts");
            var sharerAccount = account as SharerAccount
                                ?? new SharerAccount(account.Id, account.PersonId, account.PreferedLanguage)
                                {
                                    LoginIds = account.LoginIds
                                };
            sharerAccount.PrivacySettings = privacySettings;
            await accountsStore.StoreAsync(sharerAccount);
            return Ok();
        }


        [HttpGet("me/download")]
        public async Task<IActionResult> DownloadAccount([FromQuery] Language language = Language.en)
        {
            var personId = ControllerHelpers.GetPersonId(httpContextAccessor);
            if (personId == null)
                return NotFound();
            var accessGrants = await GetAccessGrants();
            var viewModel = await healthRecordViewModelBuilder.Build(personId, accessGrants, language);
            var jsonSettings = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };
            jsonSettings.Converters.Add(new StringEnumConverter());
            var json = JsonConvert.SerializeObject(viewModel, Formatting.Indented, jsonSettings);
            var stream = new MemoryStream(Encoding.UTF8.GetBytes(json));
            return File(stream, "application/json", $"health-sharing-portal_account-export_{DateTime.UtcNow:yyyy-MM-dd_HH:mm:ss}.json");
        }


        [Authorize]
        [HttpDelete("me")]
        public async Task<IActionResult> DeleteCurrentAccount()
        {
            var accountId = ControllerHelpers.GetAccountId(httpContextAccessor);
            if (accountId == null)
                return BadRequest("No account found");
            var account = await accountsStore.GetByIdAsync(accountId);
            if (account == null)
                return NotFound();
            if (account.AccountType.InSet(AccountType.EmergencyGuest, AccountType.Undefined))
                return BadRequest($"Accounts of type '{account.AccountType}' cannot be deleted");
            var accessGrants = await GetAccessGrants();
            var changedBy = new PersonDataChangeMetadata(account.Id, account.PersonId);
            var accountDeleter = accountDeleterFactory.Create(account.AccountType);
            var deletionResult = await accountDeleter.DeleteAsync(accountId, accessGrants, changedBy);

            if (!deletionResult.IsSuccess)
                return BadRequest(deletionResult.ErrorMessage);
            return Ok();
        }


        private async Task<List<IViewModel<Account>>> BuildAccountViewModels(
            List<Account> items,
            List<IPersonDataAccessGrant> accessGrants)
        {
            var viewModels = new List<IViewModel<Account>>();
            var viewModelFactory = new AccountViewModelBuilder(personsStore);
            foreach (var account in items)
            {
                var viewModel = await viewModelFactory.Build(account, new AccountViewModelBuilderOptions
                {
                    AccessGrants = accessGrants
                });
                viewModels.Add(viewModel);
            }

            return viewModels;
        }

        private async Task<List<IPersonDataAccessGrant>> GetAccessGrants()
        {
            var claims = ControllerHelpers.GetClaims(httpContextAccessor);
            return await authorizationModule.GetAccessGrants(claims);
        }
    }
}
