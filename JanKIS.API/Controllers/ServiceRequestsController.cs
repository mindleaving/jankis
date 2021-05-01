using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Models.Subscriptions;
using JanKIS.API.Storage;
using JanKIS.API.Workflow;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    public class ServiceRequestsController : RestControllerBase<ServiceRequest>
    {
        private readonly IServiceRequestsStore serviceRequestsStore;
        private readonly IReadonlyStore<Account> accountsStore;
        private readonly IReadonlyStore<InstitutionPolicy> institutionPolicyStore;
        private readonly ServiceRequestChangePolicy serviceRequestChangePolicy;
        private readonly INotificationDistributor notificationDistributor;
        private readonly ISubscriptionsStore subscriptionsStore;

        public ServiceRequestsController(
            IServiceRequestsStore serviceRequestsStore,
            IHttpContextAccessor httpContextAccessor,
            IReadonlyStore<Account> accountsStore,
            IReadonlyStore<InstitutionPolicy> institutionPolicyStore,
            ServiceRequestChangePolicy serviceRequestChangePolicy,
            INotificationDistributor notificationDistributor,
            ISubscriptionsStore subscriptionsStore)
            : base(serviceRequestsStore, httpContextAccessor)
        {
            this.serviceRequestsStore = serviceRequestsStore;
            this.institutionPolicyStore = institutionPolicyStore;
            this.serviceRequestChangePolicy = serviceRequestChangePolicy;
            this.notificationDistributor = notificationDistributor;
            this.subscriptionsStore = subscriptionsStore;
            this.accountsStore = accountsStore;
        }

        public override async Task<IActionResult> GetMany(
            int? count = null,
            int? skip = null,
            string orderBy = null,
            OrderDirection orderDirection = OrderDirection.Ascending)
        {
            Request.Query.TryGetValue("departmentId", out var departmentId);
            Request.Query.TryGetValue("serviceId", out var serviceId);
            var orderByExpression = BuildOrderByExpression(orderBy);
            var items = await serviceRequestsStore.GetManyFilteredAsync(count, skip, orderByExpression, orderDirection, departmentId, serviceId);
            return Ok(items);
        }

        /// <summary>
        /// Method for changing request as requester. NOT suitable for handler-changes,
        /// at least while change policy is only implemented with requester-changes in mind
        /// </summary>
        [HttpPatch("{requestId}")]
        public async Task<IActionResult> UpdateRequest([FromRoute] string requestId, [FromBody] ServiceRequest request)
        {
            var existingRequest = await store.GetByIdAsync(requestId);
            if (existingRequest == null)
                return NotFound();
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            var account = await accountsStore.GetByIdAsync(username);
            var institutionPolicy = await institutionPolicyStore.GetByIdAsync(InstitutionPolicy.DefaultId);
            if (!await serviceRequestChangePolicy.CanChange(existingRequest, account, institutionPolicy))
                return Forbid();
            if (!existingRequest.TrySetState(request.State, out var stateChangeError))
                return BadRequest(stateChangeError);
            existingRequest.ParameterResponses = request.ParameterResponses;
            existingRequest.RequesterNote = request.RequesterNote;
            existingRequest.HandlerNote = request.HandlerNote;
            await store.StoreAsync(existingRequest);
            return Ok();
        }

        [HttpPost("{requestId}/assign")]
        public async Task<IActionResult> AssignRequest([FromRoute] string requestId, [FromBody] string assignee)
        {
            var existingRequest = await store.GetByIdAsync(requestId);
            if (existingRequest == null)
                return NotFound();
            if (!await accountsStore.ExistsAsync(assignee))
                return BadRequest("Assignee doesn't exist");
            // TODO: Check permission to perform this action
            //var username = ControllerHelpers.GetUsername(httpContextAccessor);
            //var account = await accountsStore.GetByIdAsync(username);
            //var institutionPolicy = await institutionPolicyStore.GetByIdAsync(InstitutionPolicy.DefaultId);
            //if (!await serviceRequestChangePolicy.CanChange(existingRequest, account, institutionPolicy))
            //    return Forbid();
            existingRequest.AssignedTo = assignee;
            await store.StoreAsync(existingRequest);
            return Ok();
        }

        [HttpPost("{requestId}/changestate")]
        public async Task<IActionResult> ChangeState([FromRoute] string requestId, [FromBody] ServiceRequestState newState)
        {
            var existingRequest = await store.GetByIdAsync(requestId);
            if (existingRequest == null)
                return NotFound();
            if (existingRequest.State == newState)
                return Ok();
            // TODO: Check permission to perform this action
            //var username = ControllerHelpers.GetUsername(httpContextAccessor);
            //var account = await accountsStore.GetByIdAsync(username);
            //var institutionPolicy = await institutionPolicyStore.GetByIdAsync(InstitutionPolicy.DefaultId);
            //if (!await serviceRequestChangePolicy.CanChange(existingRequest, account, institutionPolicy))
            //    return Forbid();
            var expectedStoredState = existingRequest.State;
            if (!existingRequest.TrySetState(newState, out var stateChangeError))
                return BadRequest(stateChangeError);
            var isStateChanged = await serviceRequestsStore.TrySetStateAsync(requestId, expectedStoredState, newState);
            if(!isStateChanged)
            {
                return BadRequest(new
                {
                    Error = $"Could not change state of request '{requestId}' to {newState}. Someone else may already have changed the state.",
                    Request = existingRequest
                });
            }
            return Ok();
        }

        [HttpPut("{requestId}/handlernote")]
        public async Task<IActionResult> ChangeHandlerNote([FromRoute] string requestId, [FromBody] string handlerNote)
        {
            var existingRequest = await store.GetByIdAsync(requestId);
            if (existingRequest == null)
                return NotFound();
            // TODO: Check permission to perform this action
            //var username = ControllerHelpers.GetUsername(httpContextAccessor);
            //var account = await accountsStore.GetByIdAsync(username);
            //var institutionPolicy = await institutionPolicyStore.GetByIdAsync(InstitutionPolicy.DefaultId);
            //if (!await serviceRequestChangePolicy.CanChange(existingRequest, account, institutionPolicy))
            //    return Forbid();
            existingRequest.HandlerNote = handlerNote;
            await store.StoreAsync(existingRequest);
            return Ok();
        }


        [HttpPost("{requestId}/subscribe")]
        public async Task<IActionResult> Subscribe([FromRoute] string requestId)
        {
            var serviceRequest = await store.GetByIdAsync(requestId);
            if (serviceRequest == null)
                return NotFound();
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            var subscription = new ServiceRequestSubscription(
                Guid.NewGuid().ToString(),
                username,
                requestId);
            await subscriptionsStore.StoreAsync(subscription);
            return Ok(subscription.Id);
        }

        [HttpPost("{requestId}/unsubscribe")]
        public async Task<IActionResult> Unsubscribe([FromRoute] string requestId)
        {
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            var existingSubscription = await subscriptionsStore.GetServiceRequestSubscription(requestId, username);
            if (existingSubscription == null)
                return Ok();
            await subscriptionsStore.DeleteAsync(existingSubscription.Id);
            return Ok();
        }


        protected override Task<object> TransformItem(ServiceRequest item)
        {
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<ServiceRequest, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "id" => x => x.Id,
                "service" => x => x.Service.Name,
                "requester" => x => x.Requester,
                "assignedto" => x => x.AssignedTo,
                "time" => x => x.Timestamps[0].Timestamp,
                _ => x => x.Timestamps[0].Timestamp
            };
        }

        protected override Expression<Func<ServiceRequest, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.Or(
                SearchExpressionBuilder.ContainsAny<ServiceRequest>(x => x.Requester, searchTerms),
                SearchExpressionBuilder.ContainsAny<ServiceRequest>(x => x.AssignedTo, searchTerms),
                SearchExpressionBuilder.ContainsAny<ServiceRequest>(x => x.Service.Name, searchTerms));
        }

        protected override IEnumerable<ServiceRequest> PrioritizeItems(
            List<ServiceRequest> items,
            string searchText)
        {
            return items.OrderBy(x => x.Timestamps[0].Timestamp);
        }

        protected override async Task PublishChange(
            ServiceRequest item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            await notificationDistributor.NotifyNewServiceRequest(item, storageOperation, submitterUsername);
        }
    }
}
