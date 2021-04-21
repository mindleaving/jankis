using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Models.Subscriptions;
using JanKIS.API.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    public class ResourcesController : RestControllerBase<Resource>
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly ISubscriptionsStore subscriptionsStore;

        public ResourcesController(
            IStore<Resource> store,
            IHttpContextAccessor httpContextAccessor,
            ISubscriptionsStore subscriptionsStore)
            : base(store, httpContextAccessor)
        {
            this.httpContextAccessor = httpContextAccessor;
            this.subscriptionsStore = subscriptionsStore;
        }

        [Authorize(Policy = nameof(Permission.ViewResources))]
        public override Task<IActionResult> GetById(string id)
        {
            return base.GetById(id);
        }

        [Authorize(Policy = nameof(Permission.ViewResources))]
        public override Task<IActionResult> GetMany(
            int? count = null,
            int? skip = null,
            string orderBy = null,
            OrderDirection orderDirection = OrderDirection.Ascending)
        {
            return base.GetMany(
                count,
                skip,
                orderBy,
                orderDirection);
        }

        [Authorize(Policy = nameof(Permission.ViewResources))]
        public override Task<IActionResult> Search(
            string searchText,
            int? count = null,
            int? skip = null)
        {
            return base.Search(
                searchText,
                count,
                skip);
        }

        [Authorize(Policy = nameof(Permission.ModifyResources))]
        public override Task<IActionResult> CreateOrReplace(
            string id,
            Resource item)
        {
            return base.CreateOrReplace(id, item);
        }

        [Authorize(Policy = nameof(Permission.ModifyResources))]
        public override Task<IActionResult> Delete(string id)
        {
            return base.Delete(id);
        }

        [HttpPost("{resourceId}/subscribe")]
        public async Task<IActionResult> Subscribe([FromRoute] string resourceId)
        {
            var resource = await store.GetByIdAsync(resourceId);
            if (resource == null)
                return NotFound();
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            var subscription = new ResourceSubscription(
                Guid.NewGuid().ToString(),
                username,
                resourceId);
            await subscriptionsStore.StoreAsync(subscription);
            return Ok(subscription.Id);
        }

        [HttpPost("{resourceId}/unsubscribe")]
        public async Task<IActionResult> Unsubscribe([FromRoute] string resourceId)
        {
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            var existingSubscription = await subscriptionsStore.GetResourceSubscription(resourceId, username);
            if (existingSubscription == null)
                return Ok();
            await subscriptionsStore.DeleteAsync(existingSubscription.Id);
            return Ok();
        }

        protected override Expression<Func<Resource, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "id" => x => x.Id,
                "name" => x => x.Name,
                _ => x => x.Name
            };
        }

        protected override Expression<Func<Resource, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<Resource>(x => x.Name.ToLower(), searchTerms);
        }

        protected override IEnumerable<Resource> PrioritizeItems(
            List<Resource> items,
            string searchText)
        {
            return items.OrderBy(x => x.Name.Length);
        }

        protected override Task PublishChange(
            Resource item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            // Nothing to do
            return Task.CompletedTask;
        }
    }
}