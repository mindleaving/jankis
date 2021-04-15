using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;

namespace JanKIS.API.Controllers
{
    public class InstitutionsController : RestControllerBase<Institution>
    {
        public InstitutionsController(IStore<Institution> store)
            : base(store)
        {
        }

        protected override Expression<Func<Institution, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "id" => x => x.Id,
                "name" => x => x.Name,
                _ => x => x.Name
            };
        }

        protected override Expression<Func<Institution, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<Institution>(x => x.Name.ToLower(), searchTerms);
        }

        protected override IEnumerable<Institution> PrioritizeItems(
            List<Institution> items,
            string searchText)
        {
            return items.OrderBy(x => x.Name.Length);
        }
    }
}
