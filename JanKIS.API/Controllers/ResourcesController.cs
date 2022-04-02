using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels.Interview;
using HealthSharingPortal.API.Controllers;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.Workflow.ViewModelBuilders;
using JanKIS.API.Models;
using JanKIS.API.Models.Subscriptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ISubscriptionsStore = JanKIS.API.Storage.ISubscriptionsStore;
using SearchExpressionBuilder = JanKIS.API.Helpers.SearchExpressionBuilder;

namespace JanKIS.API.Controllers
{
    public class ResourcesController : RestControllerBase<Resource>
    {
        private readonly ISubscriptionsStore subscriptionsStore;
        private readonly IAutocompleteCache autocompleteCache;
        private readonly IViewModelBuilder<Resource> resourceViewModelBuilder;

        public ResourcesController(
            IStore<Resource> store,
            IHttpContextAccessor httpContextAccessor,
            ISubscriptionsStore subscriptionsStore,
            IAutocompleteCache autocompleteCache,
            IViewModelBuilder<Resource> resourceViewModelBuilder)
            : base(store, httpContextAccessor)
        {
            this.subscriptionsStore = subscriptionsStore;
            this.autocompleteCache = autocompleteCache;
            this.resourceViewModelBuilder = resourceViewModelBuilder;
        }

        [Authorize(Policy = nameof(Permission.ViewResources))]
        public override Task<IActionResult> GetById(string id, Language language = Language.en)
        {
            return base.GetById(id);
        }

        [Authorize(Policy = nameof(Permission.ViewResources))]
        public override Task<IActionResult> GetMany(
            int? count = null,
            int? skip = null,
            string orderBy = null,
            OrderDirection orderDirection = OrderDirection.Ascending, 
            Language language = Language.en)
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
            int? skip = null, 
            Language language = Language.en)
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

        protected override async Task<object> TransformItem(
            Resource item,
            Language language = Language.en)
        {
            return await resourceViewModelBuilder.Build(item);
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

        protected override async Task PublishChange(
            Resource item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            if (!string.IsNullOrWhiteSpace(item.GroupName))
            {
                await autocompleteCache.AddIfNotExists(new AutocompleteCacheItem(AutoCompleteContext.ResourceGroup.ToString(), item.GroupName));
            }

            if (item.Location != null && item.Location.Type == InstitutionLocationType.External)
            {
                await autocompleteCache.AddIfNotExists(new AutocompleteCacheItem(AutoCompleteContext.ExternalLocation.ToString(), item.Location.Id));
            }
        }
    }
}