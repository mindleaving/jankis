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
    [ApiController]
    [Route("api/[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountStore accountsStore;
        private readonly IReadonlyStore<Person> personsStore;
        private readonly ICachedReadonlyStore<Role> rolesStore;
        private readonly ICachedReadonlyStore<Department> departmentsStore;
        private readonly AuthenticationModule authenticationModule;

        public AccountsController(
            IAccountStore accountsStore,
            IReadonlyStore<Person> personsStore,
            ICachedReadonlyStore<Role> rolesStore,
            ICachedReadonlyStore<Department> departmentsStore,
            AuthenticationModule authenticationModule)
        {
            this.accountsStore = accountsStore;
            this.personsStore = personsStore;
            this.rolesStore = rolesStore;
            this.departmentsStore = departmentsStore;
            this.authenticationModule = authenticationModule;
        }

        [HttpGet]
        public async Task<IActionResult> GetMany(
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
            var items = await accountsStore.GetMany(count, skip, orderByExpression, orderDirection);
            var viewModels = await BuildAccountViewModels(items);
            return Ok(viewModels);
        }

        [HttpGet(nameof(Search))]
        public async Task<IActionResult> Search([FromQuery] string searchText, int? count = null, int? skip = null)
        {
            var searchTerms = SearchTermSplitter.SplitAndToLower(searchText);
            var searchExpression = SearchExpressionBuilder.ContainsAll<Account>(x => x.Username.ToLower(), searchTerms);
            var items = await accountsStore.SearchAsync(searchExpression, count, skip);
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
                items = await accountsStore.SearchAsync(x => personIds.Contains(x.PersonId));
            }
            var viewModels = await BuildAccountViewModels(items);
            return Ok(viewModels);
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


        [HttpGet("{username}")]
        public async Task<IActionResult> GetByUsername([FromRoute] string username)
        {
            var account = await accountsStore.GetByIdAsync(username);
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
        public async Task<IActionResult> CreateAccount([FromBody] AccountCreationInfo creationInfo)
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
            var userRoles = await GetUserRoles(account);
            var userPermissions = GetUserPermissions(account, userRoles);
            var departmentIds = (account as EmployeeAccount)?.DepartmentIds ?? new List<string>();
            var departments = await departmentsStore.SearchAsync(x => departmentIds.Contains(x.Id));
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
                    var role = await rolesStore.GetByIdAsync(roleId);
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
        [Authorize(Policy = nameof(Permission.ResetPasswords))]
        public async Task<IActionResult> ResetPassword([FromRoute] string username)
        {
            var password = TemporaryPasswordGenerator.Generate();
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

        [HttpPut("{username}/roles")]
        [Authorize(Policy = nameof(Permission.ChangeEmployeePermissions))]
        [Authorize(Policy = NotSameUserRequirement.PolicyName)]
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
        [Authorize(Policy = nameof(Permission.ChangeEmployeePermissions))]
        [Authorize(Policy = NotSameUserRequirement.PolicyName)]
        public async Task<IActionResult> AddRole([FromRoute] string username, [FromRoute] string roleId)
        {
            if (!await rolesStore.ExistsAsync(roleId))
                return BadRequest("No such role exists");
            if (!await accountsStore.IsEmployee(username))
                return BadRequest("Cannot add roles to non-employee accounts");
            var result = await accountsStore.AddRole(username, roleId);
            return HandleStorageResult(result);
        }

        [HttpPatch("{username}/roles/{roleId}/remove")]
        [Authorize(Policy = nameof(Permission.ChangeEmployeePermissions))]
        [Authorize(Policy = NotSameUserRequirement.PolicyName)]
        public async Task<IActionResult> RemoveRole([FromRoute] string username, [FromRoute] string roleId)
        {
            if (!await rolesStore.ExistsAsync(roleId))
                return BadRequest("No such role exists");
            if (!await accountsStore.IsEmployee(username))
                return BadRequest("Cannot add roles to non-employee accounts");
            var result = await accountsStore.RemoveRole(username, roleId);
            return HandleStorageResult(result);
        }

        [HttpPatch("{username}/permissions/{permissionId}/grant")]
        [Authorize(Policy = nameof(Permission.ChangeEmployeePermissions))]
        [Authorize(Policy = NotSameUserRequirement.PolicyName)]
        public async Task<IActionResult> GrantPermission([FromRoute] string username, [FromRoute] string permissionId)
        {
            if (!Enum.TryParse<Permission>(permissionId, true, out var permission))
                return BadRequest("Unknown permission");
            if (!await accountsStore.IsEmployee(username))
                return BadRequest("Cannot add permissions to non-employee accounts");
            var result = await accountsStore.AddPermission(username, new PermissionModifier(permission, PermissionModifierType.Grant));
            return HandleStorageResult(result);
        }

        [HttpPatch("{username}/permissions/{permissionId}/deny")]
        [Authorize(Policy = nameof(Permission.ChangeEmployeePermissions))]
        [Authorize(Policy = NotSameUserRequirement.PolicyName)]
        public async Task<IActionResult> DenyPermission([FromRoute] string username, [FromRoute] string permissionId)
        {
            if (!Enum.TryParse<Permission>(permissionId, true, out var permission))
                return BadRequest("Unknown permission");
            if (!await accountsStore.IsEmployee(username))
                return BadRequest("Cannot add permissions to non-employee accounts");
            var result = await accountsStore.AddPermission(username, new PermissionModifier(permission, PermissionModifierType.Deny));
            return HandleStorageResult(result);
        }

        [HttpPatch("{username}/permissions/{permissionId}/remove")]
        [Authorize(Policy = nameof(Permission.ChangeEmployeePermissions))]
        [Authorize(Policy = NotSameUserRequirement.PolicyName)]
        public async Task<IActionResult> RemovePermissionModifier([FromRoute] string username, [FromRoute] string permissionId)
        {
            if (!Enum.TryParse<Permission>(permissionId, true, out var permission))
                return BadRequest("Unknown permission");
            if (!await accountsStore.IsEmployee(username))
                return BadRequest("Cannot add permissions to non-employee accounts");
            var result = await accountsStore.RemovePermission(username, permission);
            return HandleStorageResult(result);
        }

        [HttpPut("{username}/departments")]
        [Authorize(Policy = nameof(Permission.ChangeEmployeePermissions))]
        [Authorize(Policy = NotSameUserRequirement.PolicyName)]
        public async Task<IActionResult> SetDepartments([FromRoute] string username, [FromBody] List<string> departmentIds)
        {
            var account = await accountsStore.GetByIdAsync(username);
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
            await accountsStore.StoreAsync(employeeAccount);
            return Ok();
        }

        [HttpPatch("{username}/departments/{departmentId}/add")]
        [Authorize(Policy = nameof(Permission.ChangeEmployeePermissions))]
        [Authorize(Policy = NotSameUserRequirement.PolicyName)]
        public async Task<IActionResult> AddDepartment([FromRoute] string username, [FromRoute] string departmentId)
        {
            var account = await accountsStore.GetByIdAsync(username);
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
            await accountsStore.StoreAsync(employeeAccount);
            return Ok();
        }

        [HttpPatch("{username}/departments/{departmentId}/remove")]
        [Authorize(Policy = nameof(Permission.ChangeEmployeePermissions))]
        [Authorize(Policy = NotSameUserRequirement.PolicyName)]
        public async Task<IActionResult> RemoveDepartment([FromRoute] string username, [FromRoute] string departmentId)
        {
            var account = await accountsStore.GetByIdAsync(username);
            if (account == null)
                return NotFound();
            if (account.AccountType != AccountType.Employee)
                return BadRequest("Cannot add departments to non-employee accounts");
            if (!await departmentsStore.ExistsAsync(departmentId))
                return BadRequest($"Department with ID '{departmentId}' doesn't exist");

            var employeeAccount = (EmployeeAccount) account;
            employeeAccount.DepartmentIds.RemoveAll(x => x == departmentId);
            await accountsStore.StoreAsync(employeeAccount);
            return Ok();
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
