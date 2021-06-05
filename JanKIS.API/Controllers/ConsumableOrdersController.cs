using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using JanKIS.API.AccessManagement;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Models.Subscriptions;
using JanKIS.API.Storage;
using JanKIS.API.ViewModels.Builders;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    public class ConsumableOrdersController : RestControllerBase<ConsumableOrder>
    {
        private readonly IViewModelBuilder<ConsumableOrder> consumableOrderViewModelBuilder;
        private readonly IReadonlyStore<Account> accountsStore;
        private readonly ISubscriptionsStore subscriptionsStore;

        public ConsumableOrdersController(
            IStore<ConsumableOrder> store,
            IHttpContextAccessor httpContextAccessor,
            IViewModelBuilder<ConsumableOrder> consumableOrderViewModelBuilder,
            IReadonlyStore<Account> accountsStore,
            ISubscriptionsStore subscriptionsStore,
            IPermissionFilterBuilder<ConsumableOrder> permissionFilterBuilder)
            : base(store, httpContextAccessor, permissionFilterBuilder)
        {
            this.consumableOrderViewModelBuilder = consumableOrderViewModelBuilder;
            this.accountsStore = accountsStore;
            this.subscriptionsStore = subscriptionsStore;
        }

        [HttpPost("{orderId}/assign")]
        public async Task<IActionResult> AssignRequest(
            [FromServices] CurrentUserProvider currentUserProvider,
            [FromRoute] string orderId, 
            [FromBody] string assignee)
        {
            var permissionFilter = await BuildPermissionFilter(currentUserProvider);
            var existingRequest = await store.GetByIdAsync(orderId, permissionFilter);
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
            await store.StoreAsync(existingRequest, permissionFilter);
            return Ok();
        }

        [HttpPost("{orderId}/changestate")]
        public async Task<IActionResult> ChangeState(
            [FromServices] CurrentUserProvider currentUserProvider,
            [FromRoute] string orderId, 
            [FromBody] OrderState newState)
        {
            var permissionFilter = await BuildPermissionFilter(currentUserProvider);
            var existingRequest = await store.GetByIdAsync(orderId, permissionFilter);
            if (existingRequest == null)
                return NotFound();
            // TODO: Check permission to perform this action
            //var username = ControllerHelpers.GetUsername(httpContextAccessor);
            //var account = await accountsStore.GetByIdAsync(username);
            //var institutionPolicy = await institutionPolicyStore.GetByIdAsync(InstitutionPolicy.DefaultId);
            //if (!await serviceRequestChangePolicy.CanChange(existingRequest, account, institutionPolicy))
            //    return Forbid();
            if (!existingRequest.TrySetState(newState, out var stateChangeError))
                return BadRequest(stateChangeError);
            await store.StoreAsync(existingRequest, permissionFilter);
            return Ok();
        }

        [HttpPost("{orderId}/subscribe")]
        public async Task<IActionResult> Subscribe([FromRoute] string orderId)
        {
            var serviceRequest = await store.GetByIdAsync(orderId);
            if (serviceRequest == null)
                return NotFound();
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            var subscription = new ConsumableOrderSubscription(
                Guid.NewGuid().ToString(),
                username,
                orderId);
            await subscriptionsStore.StoreAsync(subscription);
            return Ok(subscription.Id);
        }

        [HttpPost("{orderId}/unsubscribe")]
        public async Task<IActionResult> Unsubscribe(
            [FromServices] CurrentUserProvider currentUserProvider,
            [FromRoute] string orderId)
        {
            var currentUser = await currentUserProvider.Build();
            var existingSubscription = await subscriptionsStore.GetConsumableOrderSubscription(orderId, currentUser.Username);
            if (existingSubscription == null)
                return Ok();
            await subscriptionsStore.DeleteAsync(existingSubscription.Id);
            return Ok();
        }

        private async Task<PermissionFilter<ConsumableOrder>> BuildPermissionFilter(CurrentUserProvider currentUserProvider)
        {
            var currentUser = await currentUserProvider.Build();
            return await permissionFilterBuilder.Build(currentUser);
        }

        protected override async Task<object> TransformItem(ConsumableOrder item)
        {
            return await consumableOrderViewModelBuilder.Build(item);
        }

        protected override Expression<Func<ConsumableOrder, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "consumable" => x => x.ConsumableName,
                "state" => x => x.State,
                _ => x => x.ConsumableName
            };
        }

        protected override Expression<Func<ConsumableOrder, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<ConsumableOrder>(x => x.ConsumableName.ToLower(), searchTerms);
        }

        protected override IEnumerable<ConsumableOrder> PrioritizeItems(
            List<ConsumableOrder> items,
            string searchText)
        {
            return items;
        }

        protected override Task PublishChange(
            ConsumableOrder item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            // Nothing to do
            return Task.CompletedTask;
        }
    }
}
