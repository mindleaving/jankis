using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Interview;
using HealthSharingPortal.API.Controllers;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.Workflow.ViewModelBuilders;
using JanKIS.API.Models;
using JanKIS.API.Models.Subscriptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ISubscriptionsStore = JanKIS.API.Storage.ISubscriptionsStore;
using SearchExpressionBuilder = JanKIS.API.Helpers.SearchExpressionBuilder;

namespace JanKIS.API.Controllers
{
    public class StocksController : RestControllerBase<Stock>
    {
        private readonly ISubscriptionsStore subscriptionsStore;
        private readonly IAutocompleteCache autocompleteCache;
        private readonly IViewModelBuilder<Stock> stockViewModelBuilder;

        public StocksController(
            IStore<Stock> store,
            IHttpContextAccessor httpContextAccessor,
            ISubscriptionsStore subscriptionsStore,
            IAutocompleteCache autocompleteCache,
            IViewModelBuilder<Stock> stockViewModelBuilder)
            : base(store, httpContextAccessor)
        {
            this.subscriptionsStore = subscriptionsStore;
            this.autocompleteCache = autocompleteCache;
            this.stockViewModelBuilder = stockViewModelBuilder;
        }

        [HttpPost("{stockId}/subscribe")]
        public async Task<IActionResult> Subscribe([FromRoute] string stockId)
        {
            var stock = await store.GetByIdAsync(stockId);
            if (stock == null)
                return NotFound();
            var username = ControllerHelpers.GetAccountId(httpContextAccessor);
            var subscription = new StockSubscription(
                Guid.NewGuid().ToString(),
                username,
                stockId);
            await subscriptionsStore.StoreAsync(subscription);
            return Ok(subscription.Id);
        }

        [HttpPost("{stockId}/unsubscribe")]
        public async Task<IActionResult> Unsubscribe([FromRoute] string stockId)
        {
            var username = ControllerHelpers.GetAccountId(httpContextAccessor);
            var existingSubscription = await subscriptionsStore.GetStockSubscription(stockId, username);
            if (existingSubscription == null)
                return Ok();
            await subscriptionsStore.DeleteAsync(existingSubscription.Id);
            return Ok();
        }

        protected override async Task<object> TransformItem(
            Stock item,
            Language language = Language.en)
        {
            return await stockViewModelBuilder.Build(item);
        }

        protected override Expression<Func<Stock, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                _ => x => x.Name
            };
        }

        protected override Expression<Func<Stock, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<Stock>(x => x.Name.ToLower(), searchTerms);
        }

        protected override async Task PublishChange(
            Stock item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            if (item.Location.Type == InstitutionLocationType.External)
            {
                await autocompleteCache.AddIfNotExists(new AutocompleteCacheItem(AutoCompleteContext.ExternalLocation.ToString(), item.Location.Id));
            }
        }
    }
}
