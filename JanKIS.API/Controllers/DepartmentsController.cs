using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using JanKIS.API.Helpers;
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
    public class DepartmentsController : RestControllerBase<Department>
    {
        private readonly IStore<Department> departmentsStore;
        private readonly IReadonlyStore<Account> accountsStore;
        private readonly IStore<ServiceDefinition> servicesStore;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IStore<ServiceRequest> serviceRequestsStore;

        public DepartmentsController(
            IStore<Department> departmentsStore,
            IStore<ServiceDefinition> servicesStore,
            IReadonlyStore<Account> accountsStore,
            IStore<ServiceRequest> serviceRequestsStore,
            IHttpContextAccessor httpContextAccessor)
            : base(departmentsStore)
        {
            this.departmentsStore = departmentsStore;
            this.servicesStore = servicesStore;
            this.accountsStore = accountsStore;
            this.serviceRequestsStore = serviceRequestsStore;
            this.httpContextAccessor = httpContextAccessor;
        }

        [HttpGet(nameof(Hierarchy))]
        public async Task<IActionResult> Hierarchy()
        {
            var departments = await departmentsStore.GetAllAsync();
            throw new NotImplementedException();
            //var hierarchy = TODO;
            //return Ok(hierarchy);
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
            var personId = httpContextAccessor.HttpContext?.User.FindFirst("id")?.Value;
            var account = await accountsStore.GetByIdAsync(personId);
            if (account.AccountType != AccountType.Employee)
                return Forbid("Only employees can create and update services");
            var employeeAccount = (EmployeeAccount) account;
            var existingService = await servicesStore.GetByIdAsync(serviceId);
            if (existingService != null)
            {
                if (!employeeAccount.DepartmentIds.Contains(existingService.DepartmentId))
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

        [HttpGet("{departmentId}/services/search")]
        public async Task<IActionResult> SearchServices([FromRoute] string departmentId, [FromQuery] string searchText, int? count = null, int? skip = null)
        {
            var searchTerms = SearchTermSplitter.SplitAndToLower(searchText);
            var searchExpression = SearchExpressionBuilder.And(x => x.DepartmentId == departmentId,
                SearchExpressionBuilder.ContainsAll<ServiceDefinition>(x => x.Name.ToLower(), searchTerms));
            var departmentServices = await servicesStore.SearchAsync(searchExpression, count, skip);
            return Ok(departmentServices);
        }

        protected override Expression<Func<Department, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "id" => x => x.Id,
                "name" => x => x.Name,
                _ => x => x.Id
            };
        }

        protected override Expression<Func<Department, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<Department>(x => x.Name.ToLower(), searchTerms);
        }

        protected override IEnumerable<Department> PrioritizeItems(
            List<Department> items,
            string searchText)
        {
            return items.OrderBy(x => x.Name.Length);
        }
    }
}
