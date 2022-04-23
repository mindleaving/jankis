using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Interview;
using HealthModels.Services;
using HealthSharingPortal.API.Controllers;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.Workflow.ViewModelBuilders;
using JanKIS.API.Models;
using JanKIS.API.Models.Subscriptions;
using JanKIS.API.Workflow.ViewModelBuilders;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SearchExpressionBuilder = JanKIS.API.Helpers.SearchExpressionBuilder;
using SearchTermSplitter = JanKIS.API.Helpers.SearchTermSplitter;

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
        private readonly IStore<ServiceRequest> serviceRequestsStore;
        private readonly Storage.ISubscriptionsStore subscriptionsStore;
        private readonly IViewModelBuilder<Department> departmentViewModelBuilder;

        public DepartmentsController(
            IStore<Department> departmentsStore,
            IStore<ServiceDefinition> servicesStore,
            IReadonlyStore<Account> accountsStore,
            IStore<ServiceRequest> serviceRequestsStore,
            Storage.ISubscriptionsStore subscriptionsStore,
            IHttpContextAccessor httpContextAccessor,
            IViewModelBuilder<Department> departmentViewModelBuilder)
            : base(departmentsStore, httpContextAccessor)
        {
            this.departmentsStore = departmentsStore;
            this.servicesStore = servicesStore;
            this.accountsStore = accountsStore;
            this.serviceRequestsStore = serviceRequestsStore;
            this.subscriptionsStore = subscriptionsStore;
            this.departmentViewModelBuilder = departmentViewModelBuilder;
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
                    return Forbid();
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
            var searchExpression = SearchExpressionBuilder.And(
                x => x.DepartmentId == departmentId,
                SearchExpressionBuilder.ContainsAll<ServiceDefinition>(x => x.Name.ToLower(), searchTerms));
            var departmentServices = await servicesStore.SearchAsync(searchExpression, count, skip);
            return Ok(departmentServices);
        }

        [HttpPost("{departmentId}/subscribe")]
        public async Task<IActionResult> Subscribe([FromRoute] string departmentId)
        {
            var department = await departmentsStore.GetByIdAsync(departmentId);
            if (department == null)
                return NotFound();
            var username = ControllerHelpers.GetAccountId(httpContextAccessor);
            var subscription = new DepartmentSubscription(
                Guid.NewGuid().ToString(),
                username,
                departmentId);
            await subscriptionsStore.StoreAsync(subscription);
            return Ok(subscription.Id);
        }

        [HttpPost("{departmentId}/unsubscribe")]
        public async Task<IActionResult> Unsubscribe([FromRoute] string departmentId)
        {
            var username = ControllerHelpers.GetAccountId(httpContextAccessor);
            var existingSubscription = await subscriptionsStore.GetDepartmentSubscription(departmentId, username);
            if (existingSubscription == null)
                return Ok();
            await subscriptionsStore.DeleteAsync(existingSubscription.Id);
            return Ok();
        }


        protected override async Task<object> TransformItem(
            Department item,
            Language language = Language.en)
        {
            return await departmentViewModelBuilder.Build(item);
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

        protected override Task PublishChange(
            Department item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            // Nothing to do
            return Task.CompletedTask;
        }
    }
}
