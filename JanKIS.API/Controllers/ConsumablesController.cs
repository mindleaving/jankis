using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConsumablesController : RestControllerBase<Consumable>
    {
        public ConsumablesController(IStore<Consumable> store)
            : base(store)
        {
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

        protected override IEnumerable<Consumable> PrioritizeItems(List<Consumable> items)
        {
            return items.OrderBy(x => x.Name.Length);
        }
    }
}
