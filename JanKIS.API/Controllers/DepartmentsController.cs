using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DepartmentsController : ControllerBase
    {
        private readonly IStore<Department> departmentsStore;
        private readonly IReadonlyStore<Employee> employeesStore;
        private readonly IStore<ServiceDefinition> servicesStore;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IStore<ServiceRequest> serviceRequestsStore;

        public DepartmentsController(
            IStore<Department> departmentsStore,
            IStore<ServiceDefinition> servicesStore,
            IStore<ServiceRequest> serviceRequestsStore,
            IReadonlyStore<Employee> employeesStore,
            IHttpContextAccessor httpContextAccessor)
        {
            this.departmentsStore = departmentsStore;
            this.servicesStore = servicesStore;
            this.employeesStore = employeesStore;
            this.httpContextAccessor = httpContextAccessor;
            this.serviceRequestsStore = serviceRequestsStore;
        }

        [HttpGet(nameof(Hierarchy))]
        public async Task<IActionResult> Hierarchy()
        {
            var departments = await departmentsStore.GetAllAsync();
            throw new NotImplementedException();
            //var hierarchy = TODO;
            //return Ok(hierarchy);
        }


        [HttpGet]
        public async Task<IActionResult> GetMany(int? count = null, int? skip = null, string orderBy = null)
        {
            Expression<Func<Department, object>> orderByExpression = orderBy?.ToLower() switch
            {
                "id" => x => x.Id,
                "name" => x => x.Name,
                _ => x => x.Id
            };
            var items = await departmentsStore.GetMany(count, skip, orderByExpression);
            return Ok(items);
        }

        [HttpPut("{departmentId}")]
        [Authorize(Policy = nameof(Permission.ManageDepartments))]
        public async Task<IActionResult> CreateOrUpdate([FromRoute] string departmentId, [FromBody] Department department)
        {
            if (departmentId != department.Id)
                return BadRequest("Department-ID from route doesn't match ID in body");
            await departmentsStore.StoreAsync(department);
            return Ok(departmentId);
        }

        [HttpDelete("{departmentId}")]
        [Authorize(Policy = nameof(Permission.ManageDepartments))]
        public async Task<IActionResult> Delete([FromRoute] string departmentId)
        {
            await departmentsStore.DeleteAsync(departmentId);
            return Ok();
        }

        [HttpPut("{departmentId}/services/{serviceId}")]
        [Authorize(Policy = nameof(Permission.ManageDepartmentServices))]
        public async Task<IActionResult> CreateOrUpdateService([FromRoute] string departmentId, [FromRoute] string serviceId, [FromBody] ServiceDefinition serviceDefinition)
        {
            if (serviceDefinition == null)
                return BadRequest("Service-definition is null");
            if (serviceId != serviceDefinition.Id)
                return BadRequest("Service-ID from route doesn't match ID in body");
            if (departmentId != serviceDefinition.DepartmentId)
                return BadRequest("Department-ID of route doesn't match department-ID in body");
            var existingService = await servicesStore.GetByIdAsync(serviceId);
            if (existingService != null)
            {
                var employeeId = httpContextAccessor.HttpContext?.User.FindFirst("id")?.Value;
                var employee = await employeesStore.GetByIdAsync(employeeId);
                if (!employee.DepartmentIds.Contains(existingService.DepartmentId))
                    return Forbid("You cannot change a service of a department that you don't belong to");
            }
            await servicesStore.StoreAsync(serviceDefinition);
            return Ok(serviceDefinition.Id);
        }

        [HttpGet("{departmentId}/services")]
        public async Task<IActionResult> ListServices([FromRoute] string departmentId, int? count = null, int? skip = null)
        {
            var departmentServices = await servicesStore.SearchAsync(x => x.DepartmentId == departmentId, count, skip);
            return Ok(departmentServices);
        }
    }
}
