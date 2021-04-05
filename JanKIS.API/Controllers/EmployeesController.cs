using System;
using System.Linq.Expressions;
using System.Net;
using System.Threading.Tasks;
using JanKIS.API.AccessManagement;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly IPersonWithLoginStore<Employee> employeesStore;
        private readonly IReadonlyStore<Role> rolesStore;
        private readonly AuthenticationModule<Employee> authenticationModule;

        public EmployeesController(
            IPersonWithLoginStore<Employee> employeesStore, 
            IReadonlyStore<Role> rolesStore,
            AuthenticationModule<Employee> authenticationModule)
        {
            this.employeesStore = employeesStore;
            this.rolesStore = rolesStore;
            this.authenticationModule = authenticationModule;
        }

        [HttpGet]
        [Authorize(Policy = nameof(Permission.ListEmployees))]
        public async Task<IActionResult> GetMany(
            [FromQuery] int? count = null,
            [FromQuery] int? skip = null,
            [FromQuery] string orderBy = null,
            [FromQuery] OrderDirection? orderDirection = null)
        {
            Expression<Func<Employee, object>> orderByExpression = orderBy?.ToLower() switch
            {
                "firstname" => x => x.FirstName,
                "lastname" => x => x.LastName,
                _ => x => x.Id
            };
            var items = await employeesStore.GetMany(count, skip, orderByExpression, orderDirection ?? OrderDirection.Ascending);
            return Ok(items);
        }


        [HttpGet("{employeeId}/exists")]
        [Authorize(Policy = nameof(Permission.ListEmployees))]
        public async Task<IActionResult> Exists([FromRoute] string employeeId)
        {
            return await employeesStore.ExistsAsync(employeeId) ? Ok() : NotFound();
        }


        [HttpPut("{employeeId}")]
        [Authorize(Policy = nameof(Permission.CreateEmployees))]
        public async Task<IActionResult> CreateOrUpdate([FromRoute] string employeeId, [FromBody] EmployeeRegistrationInfo registrationInfo)
        {
            if (registrationInfo.Id != employeeId)
                return BadRequest("Employee-ID in body doesn't match route");
            var existingEmployee = await employeesStore.GetByIdAsync(employeeId);
            if (existingEmployee != null)
            {
                existingEmployee.FirstName = registrationInfo.FirstName;
                existingEmployee.LastName = registrationInfo.LastName;
                existingEmployee.InstitutionId = registrationInfo.InstitutionId;
                existingEmployee.BirthDate = registrationInfo.BirthDate;
                await employeesStore.StoreAsync(existingEmployee);
            }
            else
            {
                var employee = PersonFactory.CreateEmployee(
                    employeeId,
                    registrationInfo.FirstName,
                    registrationInfo.LastName,
                    registrationInfo.BirthDate,
                    registrationInfo.InstitutionId,
                    TemporaryPasswordGenerator.Generate()); // TODO: Store or return such that it can be printed and given to employee. Or generate in frontend.
                await employeesStore.StoreAsync(employee);
            }
            return Ok(employeeId);
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

        [HttpDelete("{employeeId}")]
        [Authorize(Policy = nameof(Permission.DeleteEmployees))]
        public async Task<IActionResult> DeleteEmployee([FromRoute] string employeeId)
        {
            await employeesStore.DeleteAsync(employeeId);
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
