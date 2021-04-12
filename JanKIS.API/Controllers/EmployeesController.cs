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
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : RestControllerBase<Employee>
    {
        private readonly IPersonWithLoginStore<Employee> employeesStore;
        private readonly IReadonlyStore<Role> rolesStore;
        private readonly AuthenticationModule<Employee> authenticationModule;

        public EmployeesController(
            IPersonWithLoginStore<Employee> employeesStore, 
            IReadonlyStore<Role> rolesStore,
            AuthenticationModule<Employee> authenticationModule)
            : base(employeesStore)
        {
            this.employeesStore = employeesStore;
            this.rolesStore = rolesStore;
            this.authenticationModule = authenticationModule;
        }

        protected override Expression<Func<Employee, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "firstname" => x => x.FirstName,
                "lastname" => x => x.LastName,
                _ => x => x.Id
            };
        }

        protected override Expression<Func<Employee, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.Or(
                SearchExpressionBuilder.ContainsAny<Employee>(x => x.Id.ToLower(), searchTerms),
                SearchExpressionBuilder.ContainsAny<Employee>(x => x.FirstName.ToLower(), searchTerms),
                SearchExpressionBuilder.ContainsAny<Employee>(x => x.LastName.ToLower(), searchTerms));
        }

        protected override IEnumerable<Employee> PrioritizeItems(
            List<Employee> items,
            string searchText)
        {
            return items.OrderBy(x => x.Id);
        }

        [HttpGet("{employeeId}/exists")]
        [Authorize(Policy = nameof(Permission.ListEmployees))]
        public async Task<IActionResult> Exists([FromRoute] string employeeId)
        {
            return await employeesStore.ExistsAsync(employeeId) ? Ok() : NotFound();
        }

        [Authorize(Policy = nameof(Permission.CreateEmployees))]
        public override async Task<IActionResult> CreateOrReplace(string id, Employee item)
        {
            return await base.CreateOrReplace(id, item);
        }

        [HttpPost("{employeeId}/login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromRoute] string employeeId, [FromBody] string password)
        {
            var authenticationResult = await authenticationModule.AuthenticateAsync(employeeId, password);
            if (!authenticationResult.IsAuthenticated)
                return StatusCode((int) HttpStatusCode.Unauthorized, authenticationResult);
            return Ok(authenticationResult);
        }

        [HttpPost("{employeeId}/resetpassword")]
        [Authorize(Policy = nameof(Permission.ResetPasswords))]
        public async Task<IActionResult> ResetPassword([FromRoute] string employeeId, [FromBody] string password)
        {
            await authenticationModule.ChangePasswordAsync(employeeId, password, true);
            return Ok();
        }

        [HttpPost("{employeeId}/changepassword")]
        [Authorize(Policy = SameUserRequirement.PolicyName)]
        public async Task<IActionResult> ChangePassword([FromRoute] string employeeId, [FromBody] string password)
        {
            await authenticationModule.ChangePasswordAsync(employeeId, password);
            return Ok();
        }

        [HttpPatch("{employeeId}/roles/{roleId}/add")]
        [Authorize(Policy = nameof(Permission.ChangeEmployeePermissions))]
        [Authorize(Policy = NotSameUserRequirement.PolicyName)]
        public async Task<IActionResult> AddRole([FromRoute] string employeeId, [FromRoute] string roleId)
        {
            if (!await rolesStore.ExistsAsync(roleId))
                return BadRequest("No such role exists");
            var result = await employeesStore.AddRole(employeeId, roleId);
            return HandleStorageResult(result);
        }

        [HttpPatch("{employeeId}/roles/{roleId}/remove")]
        [Authorize(Policy = nameof(Permission.ChangeEmployeePermissions))]
        [Authorize(Policy = NotSameUserRequirement.PolicyName)]
        public async Task<IActionResult> RemoveRole([FromRoute] string employeeId, [FromRoute] string roleId)
        {
            if (!await rolesStore.ExistsAsync(roleId))
                return BadRequest("No such role exists");
            var result = await employeesStore.AddRole(employeeId, roleId);
            return HandleStorageResult(result);
        }

        [HttpPatch("{employeeId}/permissions/{permissionId}/grant")]
        [Authorize(Policy = nameof(Permission.ChangeEmployeePermissions))]
        [Authorize(Policy = NotSameUserRequirement.PolicyName)]
        public async Task<IActionResult> GrantPermission([FromRoute] string employeeId, [FromRoute] string permissionId)
        {
            if (!Enum.TryParse<Permission>(permissionId, true, out var permission))
                return BadRequest("Unknown permission");
            var result = await employeesStore.AddPermission(employeeId, new PermissionModifier(permission, PermissionModifierType.Grant));
            return HandleStorageResult(result);
        }

        [HttpPatch("{employeeId}/permissions/{permissionId}/deny")]
        [Authorize(Policy = nameof(Permission.ChangeEmployeePermissions))]
        [Authorize(Policy = NotSameUserRequirement.PolicyName)]
        public async Task<IActionResult> DenyPermission([FromRoute] string employeeId, [FromRoute] string permissionId)
        {
            if (!Enum.TryParse<Permission>(permissionId, true, out var permission))
                return BadRequest("Unknown permission");
            var result = await employeesStore.AddPermission(employeeId, new PermissionModifier(permission, PermissionModifierType.Deny));
            return HandleStorageResult(result);
        }

        [HttpPatch("{employeeId}/permissions/{permissionId}/remove")]
        [Authorize(Policy = nameof(Permission.ChangeEmployeePermissions))]
        [Authorize(Policy = NotSameUserRequirement.PolicyName)]
        public async Task<IActionResult> RemovePermission([FromRoute] string employeeId, [FromRoute] string permissionId)
        {
            if (!Enum.TryParse<Permission>(permissionId, true, out var permission))
                return BadRequest("Unknown permission");
            var result = await employeesStore.RemovePermission(employeeId, permission);
            return HandleStorageResult(result);
        }

        [Authorize(Policy = nameof(Permission.DeleteEmployees))]
        public override async Task<IActionResult> Delete(string id)
        {
            return await base.Delete(id);
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
