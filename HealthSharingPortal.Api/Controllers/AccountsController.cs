using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.ViewModels;
using HealthSharingPortal.API.Workflow.ViewModelBuilders;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountStore accountsStore;
        private readonly IReadonlyStore<Person> personsStore;
        private readonly AuthenticationModule authenticationModule;
        private readonly IHttpContextAccessor httpContextAccessor;

        public AccountsController(
            IAccountStore accountsStore,
            IReadonlyStore<Person> personsStore,
            AuthenticationModule authenticationModule,
            IHttpContextAccessor httpContextAccessor)
        {
            this.accountsStore = accountsStore;
            this.personsStore = personsStore;
            this.authenticationModule = authenticationModule;
            this.httpContextAccessor = httpContextAccessor;
        }

        [HttpGet]
        public async Task<IActionResult> GetMany(
            [FromQuery] int? count = null,
            [FromQuery] int? skip = null,
            [FromQuery] string orderBy = null,
            [FromQuery] OrderDirection orderDirection = OrderDirection.Ascending)
        {
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            if (accountType != AccountType.Admin)
                return Forbid();
            Expression<Func<Account, object>> orderByExpression = orderBy?.ToLower() switch
            {
                "id" => x => x.Id,
                "username" => x => x.Username,
                "accounttype" => x => x.AccountType,
                "personid" => x => x.PersonId,
                _ => x => x.Username
            };
            var items = await accountsStore.GetMany(count, skip, orderByExpression, orderDirection);
            var viewModels = await BuildAccountViewModels(items);
            return Ok(viewModels);
        }

        [HttpGet("search/{accountType?}")]
        public async Task<IActionResult> Search(
            [FromQuery] string searchText, 
            [FromRoute] AccountType? accountType = null,
            [FromQuery] int? count = null, 
            [FromQuery] int? skip = null)
        {
            var currentUserAccountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            if (currentUserAccountType != AccountType.Admin 
                && !(currentUserAccountType == AccountType.Sharer && accountType == AccountType.HealthProfessional))
            {
                return Forbid();
            }
            var accountFilterExpressions = new List<Expression<Func<Account, bool>>>();
            var searchTerms = SearchTermSplitter.SplitAndToLower(searchText);
            var searchExpression = SearchExpressionBuilder.ContainsAll<Account>(x => x.Username.ToLower(), searchTerms);
            accountFilterExpressions.Add(searchExpression);
            if(accountType.HasValue)
                accountFilterExpressions.Add(x => x.AccountType == accountType.Value);
            var combinedAccountFilter = SearchExpressionBuilder.And(accountFilterExpressions.ToArray());
            var items = await accountsStore.SearchAsync(combinedAccountFilter, count, skip);
            if (!items.Any())
            {
                var personSearchExpression = SearchExpressionBuilder.Or(
                    SearchExpressionBuilder.ContainsAny<Person>(x => x.FirstName.ToLower(), searchTerms),
                    SearchExpressionBuilder.ContainsAny<Person>(x => x.LastName.ToLower(), searchTerms));
                var matchingPersons = await personsStore.SearchAsync(
                    personSearchExpression,
                    count,
                    skip);
                var personIds = matchingPersons.Select(person => person.Id).ToList();
                accountFilterExpressions = new List<Expression<Func<Account, bool>>>
                {
                    x => personIds.Contains(x.PersonId)
                };
                if(accountType.HasValue)
                    accountFilterExpressions.Add(x => x.AccountType == accountType.Value);
                combinedAccountFilter = SearchExpressionBuilder.And(accountFilterExpressions.ToArray());
                items = await accountsStore.SearchAsync(combinedAccountFilter);
            }
            var viewModels = await BuildAccountViewModels(items);
            return Ok(viewModels);
        }


        [HttpGet("{username}")]
        public async Task<IActionResult> GetByUsername([FromRoute] string username)
        {
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            if (accountType != AccountType.Admin)
                return Forbid();
            var account = await accountsStore.GetByIdAsync(username);
            if (account == null)
                return NotFound();
            var viewModelFactory = new AccountViewModelBuilder(personsStore);
            var viewModel = await viewModelFactory.Build(account);
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
            if (!await personsStore.ExistsAsync(creationInfo.PersonId))
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
            var person = await personsStore.GetByIdAsync(account.PersonId);
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
                account.AccountType);
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

        private async Task<List<IViewModel<Account>>> BuildAccountViewModels(List<Account> items)
        {
            var viewModels = new List<IViewModel<Account>>();
            var viewModelFactory = new AccountViewModelBuilder(personsStore);
            foreach (var account in items)
            {
                var viewModel = await viewModelFactory.Build(account);
                viewModels.Add(viewModel);
            }

            return viewModels;
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
