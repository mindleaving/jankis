using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using Microsoft.AspNetCore.Http;

namespace HealthSharingPortal.API.Controllers
{
    public class StudiesController : RestControllerBase<Study>
    {
        public StudiesController(IStore<Study> store, IHttpContextAccessor httpContextAccessor)
            : base(store, httpContextAccessor)
        {
        }

        protected override Task<object> TransformItem(Study item)
        {
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<Study, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "title" => x => x.Title,
                _ => x => x.Id
            };
        }

        protected override Expression<Func<Study, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.And(
                SearchExpressionBuilder.ContainsAny<Study>(x => x.Title.ToLower(), searchTerms),
                SearchExpressionBuilder.ContainsAny<Study>(x => x.Description.ToLower(), searchTerms)
            );
        }

        protected override IEnumerable<Study> PrioritizeItems(List<Study> items, string searchText)
        {
            return items;
        }
    }
}
