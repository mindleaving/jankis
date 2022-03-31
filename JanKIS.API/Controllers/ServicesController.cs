using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels.Interview;
using HealthModels.Services;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Models.Subscriptions;
using JanKIS.API.Storage;
using JanKIS.API.Workflow;
using JanKIS.API.Workflow.ViewModelBuilders;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ServicesController : RestControllerBase<ServiceDefinition>
    {
        private readonly IServiceStore servicesStore;
        private readonly IStore<ServiceRequest> serviceRequestsStore;
        private readonly INotificationDistributor notificationDistributor;
        private readonly ISubscriptionsStore subscriptionsStore;
        private readonly IViewModelBuilder<ServiceDefinition> serviceViewModelBuilder;

        public ServicesController(
            IServiceStore servicesStore,
            IStore<ServiceRequest> serviceRequestsStore,
            IHttpContextAccessor httpContextAccessor,
            INotificationDistributor notificationDistributor,
            ISubscriptionsStore subscriptionsStore,
            IViewModelBuilder<ServiceDefinition> serviceViewModelBuilder)
            : base(servicesStore, httpContextAccessor)
        {
            this.servicesStore = servicesStore;
            this.serviceRequestsStore = serviceRequestsStore;
            this.notificationDistributor = notificationDistributor;
            this.subscriptionsStore = subscriptionsStore;
            this.serviceViewModelBuilder = serviceViewModelBuilder;
        }

        public override async Task<IActionResult> GetMany(
            int? count = null,
            int? skip = null,
            string orderBy = null,
            OrderDirection orderDirection = OrderDirection.Ascending)
        {
            Request.Query.TryGetValue("departmentId", out var departmentId);
            var orderByExpression = BuildOrderByExpression(orderBy);
            var items = await servicesStore.GetManyFiltered(count, skip, orderByExpression, orderDirection, departmentId);
            var transformedItems = await TransformItems(items);
            return Ok(transformedItems);
        }

        [HttpPost("{serviceId}/request")]
        public async Task<IActionResult> RequestService([FromRoute] string serviceId, [FromBody] ServiceRequest request)
        {
            if (serviceId != request.Service.Id)
                return BadRequest("Service-ID of route doesn't match service-ID in request");
            var service = await servicesStore.GetByIdAsync(serviceId);
            if (service == null)
                return NotFound();
            request.Service = service;
            if (string.IsNullOrWhiteSpace(request.Id))
                request.Id = Guid.NewGuid().ToString();
            if (await serviceRequestsStore.ExistsAsync(request.Id))
                return Conflict("A request with that ID already exists");
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            request.Timestamps = new List<ServiceRequestStateChange> {new(ServiceRequestState.Requested, DateTime.UtcNow)};
            request.Requester = username;
            await serviceRequestsStore.StoreAsync(request);
            // TODO: Distribute request through hub
            return Ok(request.Id);
        }

        [HttpPost("{serviceId}/subscribe")]
        public async Task<IActionResult> Subscribe([FromRoute] string serviceId)
        {
            var service = await servicesStore.GetByIdAsync(serviceId);
            if (service == null)
                return NotFound();
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            var subscription = new ServiceSubscription(
                Guid.NewGuid().ToString(),
                username,
                serviceId);
            await subscriptionsStore.StoreAsync(subscription);
            return Ok(subscription.Id);
        }

        [HttpPost("{serviceId}/unsubscribe")]
        public async Task<IActionResult> Unsubscribe([FromRoute] string serviceId)
        {
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            var existingSubscription = await subscriptionsStore.GetServiceSubscription(serviceId, username);
            if (existingSubscription == null)
                return Ok();
            await subscriptionsStore.DeleteAsync(existingSubscription.Id);
            return Ok();
        }

        protected override async Task<object> TransformItem(
            ServiceDefinition item,
            Language language = Language.en)
        {
            return await serviceViewModelBuilder.Build(item);
        }

        protected override Expression<Func<ServiceDefinition, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "id" => x => x.Id,
                "name" => x => x.Name,
                "department" => x => x.DepartmentId,
                _ => x => x.Name
            };
        }

        protected override Expression<Func<ServiceDefinition, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<ServiceDefinition>(x => x.Name.ToLower(), searchTerms);
        }

        protected override IEnumerable<ServiceDefinition> PrioritizeItems(
            List<ServiceDefinition> items,
            string searchText)
        {
            return items.OrderBy(x => x.Name.Length);
        }

        protected override async Task PublishChange(
            ServiceDefinition item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            await notificationDistributor.NotifyNewService(item, storageOperation, submitterUsername);
        }
    }
}
