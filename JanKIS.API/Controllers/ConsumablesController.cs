using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using JanKIS.API.Workflow;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConsumablesController : RestControllerBase<Consumable>
    {
        private readonly INotificationDistributor notificationDistributor;

        public ConsumablesController(
            IStore<Consumable> store,
            INotificationDistributor notificationDistributor,
            IHttpContextAccessor httpContextAccessor)
            : base(store, httpContextAccessor)
        {
            this.notificationDistributor = notificationDistributor;
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
