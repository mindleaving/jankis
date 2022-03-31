using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels.Interview;
using HealthSharingPortal.API.Controllers;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.ViewModels;
using HealthSharingPortal.API.Workflow.ViewModelBuilders;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using JanKIS.API.Workflow.ViewModelBuilders;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    public class ConsumablesController : RestControllerBase<Consumable>
    {
        private readonly IStore<ConsumableOrder> consumableOrdersStore;
        private readonly IViewModelBuilder<Consumable> consumableViewModelBuilder;
        private readonly IViewModelBuilder<ConsumableOrder> consumableOrderViewModelBuilder;

        public ConsumablesController(
            IStore<Consumable> store,
            IHttpContextAccessor httpContextAccessor,
            IViewModelBuilder<Consumable> consumableViewModelBuilder,
            IStore<ConsumableOrder> consumableOrdersStore,
            IViewModelBuilder<ConsumableOrder> consumableOrderViewModelBuilder)
            : base(store, httpContextAccessor)
        {
            this.consumableViewModelBuilder = consumableViewModelBuilder;
            this.consumableOrdersStore = consumableOrdersStore;
            this.consumableOrderViewModelBuilder = consumableOrderViewModelBuilder;
        }

        [HttpPut("{consumableId}/orders")]
        public async Task<IActionResult> GetOrders([FromRoute] string consumableId, int? count = null, int? skip = null)
        {
            var items = await consumableOrdersStore.SearchAsync(x => x.ConsumableId == consumableId, count, skip);
            var transformedItems = new List<IViewModel<ConsumableOrder>>();
            foreach (var consumableOrder in items)
            {
                var consumableOrderViewModel = await consumableOrderViewModelBuilder.Build(consumableOrder);
                transformedItems.Add(consumableOrderViewModel);
            }
            return Ok(transformedItems);
        }

        [HttpPut("{consumableId}/orders/{orderId}")]
        public async Task<IActionResult> OrderConsumable([FromRoute] string consumableId, [FromRoute] string orderId, ConsumableOrder order)
        {
            if (order.ConsumableId != consumableId)
                return BadRequest("Consumable ID from route doesn't match order");
            if (order.Id != orderId)
                return BadRequest("Order ID from route doesn't match order");
            await consumableOrdersStore.StoreAsync(order);
            return Ok();
        }

        protected override async Task<object> TransformItem(
            Consumable item,
            Language language = Language.en)
        {
            return await consumableViewModelBuilder.Build(item);
        }

        protected override Expression<Func<Consumable, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "id" => x => x.Id,
                "name" => x => x.Name,
                _ => x => x.Name
            };
        }

        protected override Expression<Func<Consumable, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<Consumable>(x => x.Name.ToLower(), searchTerms);
        }

        protected override IEnumerable<Consumable> PrioritizeItems(
            List<Consumable> items,
            string searchText)
        {
            return items.OrderBy(x => x.Name.Length);
        }

        protected override Task PublishChange(
            Consumable item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            // Nothing to do 
            return Task.CompletedTask;
        }
    }
}
