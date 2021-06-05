using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Threading.Tasks;
using JanKIS.API.AccessManagement;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using JanKIS.API.ViewModels;
using JanKIS.API.ViewModels.Builders;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountStore accountsStore;
        private readonly IReadonlyStore<Person> personsStore;
        private readonly ICachedReadonlyStore<Role> rolesStore;
        private readonly ICachedReadonlyStore<Department> departmentsStore;
        private readonly AuthenticationModule authenticationModule;
        private readonly AccountPermissionFilterBuilder accountPermissionFilterBuilder;
        private readonly PersonPermissionFilterBuilder personPermissionFilterBuilder;

        public AccountsController(
            IAccountStore accountsStore,
            IReadonlyStore<Person> personsStore,
            ICachedReadonlyStore<Role> rolesStore,
            ICachedReadonlyStore<Department> departmentsStore,
            AuthenticationModule authenticationModule,
            AccountPermissionFilterBuilder accountPermissionFilterBuilder,
            PersonPermissionFilterBuilder personPermissionFilterBuilder)
        {
            this.accountsStore = accountsStore;
            this.personsStore = personsStore;
            this.rolesStore = rolesStore;
            this.departmentsStore = departmentsStore;
            this.authenticationModule = authenticationModule;
            this.accountPermissionFilterBuilder = accountPermissionFilterBuilder;
            this.personPermissionFilterBuilder = personPermissionFilterBuilder;
        }

        [HttpGet]
        public async Task<IActionResult> GetMany(
            [FromServices] CurrentUserProvider currentUserProvider,
            [FromQuery] int? count = null,
            [FromQuery] int? skip = null,
            [FromQuery] string orderBy = null,
            [FromQuery] OrderDirection orderDirection = OrderDirection.Ascending)
        {
            Expression<Func<Account, object>> orderByExpression = orderBy?.ToLower() switch
            {
                "id" => x => x.Id,
                "username" => x => x.Username,
                "accounttype" => x => x.AccountType,
                "personid" => x => x.PersonId,
                _ => x => x.Username
            };
            var permissionFilter = await BuildPermissionFilter(currentUserProvider);
            var items = await accountsStore.GetMany(count, skip, orderByExpression, orderDirection, permissionFilter);
            var viewModels = await BuildAccountViewModels(items);
            return Ok(viewModels);
        }

        [HttpGet(nameof(Search))]
        public async Task<IActionResult> Search(
            [FromServices] CurrentUserProvider currentUserProvider,
            [FromQuery] string searchText, 
            [FromQuery] int? count = null, 
            [FromQuery] int? skip = null)
        {
            var searchTerms = SearchTermSplitter.SplitAndToLower(searchText);
            var searchExpression = SearchExpressionBuilder.ContainsAll<Account>(x => x.Username.ToLower(), searchTerms);
            var currentUser = await currentUserProvider.Build();
            var accountPermissionFilter = await accountPermissionFilterBuilder.Build(currentUser);
            var items = await accountsStore.SearchAsync(searchExpression, accountPermissionFilter, count, skip);
            if (!items.Any())
            {
                var personSearchExpression = SearchExpressionBuilder.Or(
                    SearchExpressionBuilder.ContainsAny<Person>(x => x.FirstName.ToLower(), searchTerms),
                    SearchExpressionBuilder.ContainsAny<Person>(x => x.LastName.ToLower(), searchTerms));
                var personPermissionFilter = await personPermissionFilterBuilder.Build(currentUser);
                var matchingPersons = await personsStore.SearchAsync(
                    personSearchExpression,
                    personPermissionFilter,
                    count,
                    skip);
                var personIds = matchingPersons.Select(person => person.Id).ToList();
                items = await accountsStore.SearchAsync(x => personIds.Contains(x.PersonId), accountPermissionFilter);
            }
            var viewModels = await BuildAccountViewModels(items);
            return Ok(viewModels);
        }

        [HttpGet("{username}")]
        public async Task<IActionResult> GetByUsername(
            [FromServices] CurrentUserProvider currentUserProvider,
            [FromRoute] string username)
        {
            var permissionFilter = await BuildPermissionFilter(currentUserProvider);
            var account = await accountsStore.GetByIdAsync(username, permissionFilter);
            if (account == null)
                return NotFound();
            var viewModelFactory = new AccountViewModelBuilder(rolesStore, departmentsStore, personsStore);
            var viewModel = await viewModelFactory.Build(account);
            return Ok(viewModel);
        }


        [HttpGet("{username}/exists")]
        public async Task<IActionResult> Exists([FromRoute] string username)
        {
            return await accountsStore.ExistsAsync(username) ? Ok() : NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> CreateAccount(
            [FromServices] CurrentUserProvider currentUserProvider,
            [FromBody] AccountCreationInfo creationInfo)
        {
            if (!await personsStore.ExistsAsync(creationInfo.PersonId))
                return BadRequest($"Person with ID '{creationInfo.PersonId}' doesn't exist");
            var password = TemporaryPasswordGenerator.Generate();
            Account account = creationInfo.AccountType switch
            {
                AccountType.Employee => AccountFactory.CreateEmployeeAccount(
                    creationInfo.PersonId,
                    creationInfo.Username,
                    password),
                AccountType.Patient => AccountFactory.CreatePatientAccount(
                    creationInfo.PersonId,
                    creationInfo.Username,
                    password),
                _ => throw new NotSupportedException($"Account creation is not implemented for account type '{creationInfo.AccountType}'")
            };
            var permissionFilter = await BuildPermissionFilter(currentUserProvider);
            await accountsStore.StoreAsync(account, permissionFilter);
            return Ok(password);
        }

        [AllowAnonymous]
        [HttpPost("{username}/login")]
        public async Task<IActionResult> Login([FromRoute] string username, [FromBody] string password)
        {
            var account = await accountsStore.GetByIdAsync(username, PermissionFilter<Account>.FullyAuthorized(TODO));
            if(account == null)
                return NotFound();
            var person = await personsStore.GetByIdAsync(account.PersonId, PermissionFilter<Person>.FullyAuthorized(TODO));
            if (person == null)
                return NotFound();
            var authenticationResult = await authenticationModule.AuthenticateAsync(person, account, password);
            if (!authenticationResult.IsAuthenticated)
                return StatusCode((int) HttpStatusCode.Unauthorized, authenticationResult);
            var userRoles = await GetUserRoles(account);
            var userPermissions = GetUserPermissions(account, userRoles);
            List<Department> departments;
            if (account.AccountType == AccountType.Employee)
            {
                var employeeAccount = (EmployeeAccount) account;
                var departmentIds = employeeAccount.DepartmentIds;
                departments = await departmentsStore.SearchAsync(x => departmentIds.Contains(x.Id), PermissionFilter<Department>.FullyAuthorized(TODO));
            }
            else
            {
                departments = new List<Department>();
            }

            var userViewModel = new LoggedInUserViewModel(
                person,
                authenticationResult,
                username,
                account.IsPasswordChangeRequired,
                account.AccountType,
                userRoles,
                userPermissions,
                departments);
            return Ok(userViewModel);
        }

        private async Task<List<IViewModel<Account>>> BuildAccountViewModels(List<Account> items)
        {
            var viewModels = new List<IViewModel<Account>>();
            var viewModelFactory = new AccountViewModelBuilder(
                rolesStore,
                departmentsStore,
                personsStore);
            foreach (var account in items)
            {
                var viewModel = await viewModelFactory.Build(account);
                viewModels.Add(viewModel);
            }

            return viewModels;
        }

        private async Task<List<Role>> GetUserRoles(Account account)
        {
            if (account.AccountType == AccountType.Patient)
                return new List<Role> { SystemRoles.Patient };
            if (account.AccountType == AccountType.Employee)
            {
                var employeeAccount = (EmployeeAccount) account;
                var roles = new List<Role>();
                foreach (var roleId in employeeAccount.Roles)
                {
                    var role = await rolesStore.GetByIdAsync(roleId, PermissionFilter<Role>.FullyAuthorized(TODO));
                    if(role != null)
                        roles.Add(role);
                }
                return roles;
            }
            throw new NotSupportedException($"Getting user roles for account of type '{account.AccountType}' is not implemented");
        }

        private List<Permission> GetUserPermissions(
            Account account,
            List<Role> userRoles)
        {
            var permissionAggregator = new PermissionsAggregator(rolesStore);
            if (account.AccountType == AccountType.Patient)
                return permissionAggregator.Aggregate(userRoles, new List<PermissionModifier>());
            if (account.AccountType == AccountType.Employee)
            {
                var employeeAccount = (EmployeeAccount) account;
                return permissionAggregator.Aggregate(userRoles, employeeAccount.PermissionModifiers);
            }
            throw new NotSupportedException($"Getting user permissions for account of type '{account.AccountType}' is not implemented");
        }

        [HttpPost("{username}/resetpassword")]
        public async Task<IActionResult> ResetPassword([FromRoute] string username)
        {
            var password = TemporaryPasswordGenerator.Generate();
            await authenticationModule.ChangePasswordAsync(username, password, true);
            return Ok(password);
        }

        [HttpPost("{username}/changepassword")]
        public async Task<IActionResult> ChangePassword([FromRoute] string username, [FromBody] string password)
        {
            await authenticationModule.ChangePasswordAsync(username, password);
            return Ok();
        }

        [HttpPut("{username}/roles")]
        public async Task<IActionResult> SetRoles([FromRoute] string username, [FromBody] List<string> roleIds)
        {
            foreach (var roleId in roleIds)
            {
                if (!await rolesStore.ExistsAsync(roleId))
                    return BadRequest($"Role with ID '{roleId}' doesn't exist");
            }
            var result = await accountsStore.SetRoles(username, roleIds);
            return HandleStorageResult(result);
        }

        [HttpPatch("{username}/roles/{roleId}/add")]
        public async Task<IActionResult> AddRole(
            [FromRoute] string username,
            [FromRoute] string roleId)
        {
            if (!await rolesStore.ExistsAsync(roleId))
                return BadRequest("No such role exists");
            if (!await accountsStore.IsEmployee(username, TODO))
                return BadRequest("Cannot add roles to non-employee accounts");
            var result = await accountsStore.AddRole(username, roleId);
            return HandleStorageResult(result);
        }

        [HttpPatch("{username}/roles/{roleId}/remove")]
        public async Task<IActionResult> RemoveRole(
            [FromRoute] string username,
            [FromRoute] string roleId)
        {
            if (!await rolesStore.ExistsAsync(roleId))
                return BadRequest("No such role exists");
            if (!await accountsStore.IsEmployee(username, TODO))
                return BadRequest("Cannot add roles to non-employee accounts");
            var result = await accountsStore.RemoveRole(username, roleId);
            return HandleStorageResult(result);
        }

        [HttpPatch("{username}/permissions/{permissionId}/grant")]
        public async Task<IActionResult> GrantPermission(
            [FromRoute] string username,
            [FromRoute] string permissionId)
        {
            if (!Enum.TryParse<Permission>(permissionId, true, out var permission))
                return BadRequest("Unknown permission");
            if (!await accountsStore.IsEmployee(username, TODO))
                return BadRequest("Cannot add permissions to non-employee accounts");
            var result = await accountsStore.AddPermission(username, new PermissionModifier(permission, PermissionModifierType.Grant));
            return HandleStorageResult(result);
        }

        [HttpPatch("{username}/permissions/{permissionId}/deny")]
        public async Task<IActionResult> DenyPermission(
            [FromRoute] string username,
            [FromRoute] string permissionId)
        {
            if (!Enum.TryParse<Permission>(permissionId, true, out var permission))
                return BadRequest("Unknown permission");
            if (!await accountsStore.IsEmployee(username, TODO))
                return BadRequest("Cannot add permissions to non-employee accounts");
            var result = await accountsStore.AddPermission(username, new PermissionModifier(permission, PermissionModifierType.Deny));
            return HandleStorageResult(result);
        }

        [HttpPatch("{username}/permissions/{permissionId}/remove")]
        public async Task<IActionResult> RemovePermissionModifier(
            [FromRoute] string username,
            [FromRoute] string permissionId)
        {
            if (!Enum.TryParse<Permission>(permissionId, true, out var permission))
                return BadRequest("Unknown permission");
            if (!await accountsStore.IsEmployee(username, TODO))
                return BadRequest("Cannot add permissions to non-employee accounts");
            var result = await accountsStore.RemovePermission(username, permission);
            return HandleStorageResult(result);
        }

        [HttpPut("{username}/departments")]
        public async Task<IActionResult> SetDepartments(
            [FromServices] CurrentUserProvider currentUserProvider,
            [FromRoute] string username, 
            [FromBody] List<string> departmentIds)
        {
            var permissionFilter = await BuildPermissionFilter(currentUserProvider);
            var account = await accountsStore.GetByIdAsync(username, permissionFilter);
            if (account == null)
                return NotFound();
            if (account.AccountType != AccountType.Employee)
                return BadRequest("Cannot add departments to non-employee accounts");
            foreach (var departmentId in departmentIds)
            {
                if (!await departmentsStore.ExistsAsync(departmentId))
                    return BadRequest($"Department with ID '{departmentId}' doesn't exist");
            }

            var employeeAccount = (EmployeeAccount) account;
            employeeAccount.DepartmentIds = departmentIds;
            await accountsStore.StoreAsync(employeeAccount, permissionFilter);
            return Ok();
        }

        [HttpPatch("{username}/departments/{departmentId}/add")]
        public async Task<IActionResult> AddDepartment(
            [FromServices] CurrentUserProvider currentUserProvider,
            [FromRoute] string username,
            [FromRoute] string departmentId)
        {
            var permissionFilter = await BuildPermissionFilter(currentUserProvider);
            var account = await accountsStore.GetByIdAsync(username, permissionFilter);
            if (account == null)
                return NotFound();
            if (account.AccountType != AccountType.Employee)
                return BadRequest("Cannot add departments to non-employee accounts");
            if (!await departmentsStore.ExistsAsync(departmentId))
                return BadRequest($"Department with ID '{departmentId}' doesn't exist");

            var employeeAccount = (EmployeeAccount) account;
            if (employeeAccount.DepartmentIds.Contains(departmentId))
                return Ok();
            employeeAccount.DepartmentIds.Add(departmentId);
            await accountsStore.StoreAsync(employeeAccount, permissionFilter);
            return Ok();
        }

        [HttpPatch("{username}/departments/{departmentId}/remove")]
        public async Task<IActionResult> RemoveDepartment(
            [FromServices] CurrentUserProvider currentUserProvider,
            [FromRoute] string username,
            [FromRoute] string departmentId)
        {
            var permissionFilter = await BuildPermissionFilter(currentUserProvider);
            var account = await accountsStore.GetByIdAsync(username, permissionFilter);
            if (account == null)
                return NotFound();
            if (account.AccountType != AccountType.Employee)
                return BadRequest("Cannot add departments to non-employee accounts");
            if (!await departmentsStore.ExistsAsync(departmentId))
                return BadRequest($"Department with ID '{departmentId}' doesn't exist");

            var employeeAccount = (EmployeeAccount) account;
            employeeAccount.DepartmentIds.RemoveAll(x => x == departmentId);
            await accountsStore.StoreAsync(employeeAccount, permissionFilter);
            return Ok();
        }

        private async Task<PermissionFilter<Account>> BuildPermissionFilter(CurrentUserProvider currentUserProvider)
        {
            var currentUser = await currentUserProvider.Build();
            return await accountPermissionFilterBuilder.Build(currentUser);
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
