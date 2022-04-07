using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.AccessControl;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.ViewModels;
using HealthSharingPortal.API.Workflow.ViewModelBuilders;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using IAuthenticationModule = HealthSharingPortal.API.AccessControl.IAuthenticationModule;

namespace HealthSharingPortal.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountStore accountsStore;
        private readonly IPersonDataReadonlyStore<Person> personsStore;
        private readonly IAuthenticationModule authenticationModule;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IAuthorizationModule authorizationModule;

        public AccountsController(
            IAccountStore accountsStore,
            IPersonDataReadonlyStore<Person> personsStore,
            IAuthenticationModule authenticationModule,
            IHttpContextAccessor httpContextAccessor,
            IAuthorizationModule authorizationModule)
        {
            this.accountsStore = accountsStore;
            this.personsStore = personsStore;
            this.authenticationModule = authenticationModule;
            this.httpContextAccessor = httpContextAccessor;
            this.authorizationModule = authorizationModule;
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
                "username" => x => x.Username,
                "accounttype" => x => x.AccountType,
                "personid" => x => x.PersonId,
                _ => x => x.Username
            };
            var accountFilterExpressions = new List<Expression<Func<Account, bool>>>();
            var searchTerms = SearchTermSplitter.SplitAndToLower(searchText);
            var searchExpression = SearchExpressionBuilder.ContainsAll<Account>(x => x.Username.ToLower(), searchTerms);
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


        [HttpGet("{username}/exists")]
        public async Task<IActionResult> Exists([FromRoute] string username)
        {
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            if (accountType != AccountType.Admin)
                return Forbid();
            return await accountsStore.ExistsAsync(username) ? Ok() : NotFound();
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> CreateAccount([FromBody] AccountCreationInfo creationInfo)
        {
            var readAccessGrant = new PersonDataAccessGrant(creationInfo.PersonId, new[] { AccessPermissions.Read });
            if (!await personsStore.ExistsAsync(creationInfo.PersonId, new List<IPersonDataAccessGrant> { readAccessGrant }))
                return BadRequest($"Person with ID '{creationInfo.PersonId}' doesn't exist");
            var password = new TemporaryPasswordGenerator().Generate();
            var account = AccountFactory.Create(creationInfo.PersonId, creationInfo.Username, creationInfo.AccountType, password);
            await accountsStore.StoreAsync(account);
            return Ok(password);
        }


        [HttpPost("{username}/login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromRoute] string username, [FromBody] string password)
        {
            var account = await accountsStore.GetByIdAsync(username);
            if(account == null)
                return NotFound();
            var readAccessGrant = new PersonDataAccessGrant(account.PersonId, new[] { AccessPermissions.Read });
            var person = await personsStore.GetByIdAsync(account.PersonId, new List<IPersonDataAccessGrant> { readAccessGrant });
            if (person == null)
                return NotFound();
            var authenticationResult = await authenticationModule.AuthenticateAsync(person, account, password);
            if (!authenticationResult.IsAuthenticated)
                return StatusCode((int) HttpStatusCode.Unauthorized, authenticationResult);
            var userViewModel = new LoggedInUserViewModel(
                person,
                authenticationResult,
                username,
                account.IsPasswordChangeRequired,
                account.AccountType,
                account.PreferedLanguage);
            return Ok(userViewModel);
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

        private IActionResult HandleStorageResult(StorageResult result)
        {
            if (result.IsSuccess)
                return Ok();
            if (result.ErrorType == StoreErrorType.NoMatch)
                return NotFound();
            return StatusCode((int) HttpStatusCode.InternalServerError);
        }
    }
}
