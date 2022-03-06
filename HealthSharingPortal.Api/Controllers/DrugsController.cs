using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Medication;
using HealthSharingPortal.Api.Helpers;
using HealthSharingPortal.Api.Models;
using HealthSharingPortal.Api.Storage;
using Microsoft.AspNetCore.Http;

namespace HealthSharingPortal.Api.Controllers
{
    public class DrugsController : RestControllerBase<Drug>
    {
        private readonly IAutocompleteCache autocompleteCache;

        public DrugsController(
            IStore<Drug> store,
            IHttpContextAccessor httpContextAccessor,
            IAutocompleteCache autocompleteCache)
            : base(store, httpContextAccessor)
        {
            this.autocompleteCache = autocompleteCache;
        }

        protected override Task<object> TransformItem(Drug item)
        {
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<Drug, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "name" => x => x.ProductName,
                "brand" => x => x.Brand,
                _ => x => x.ProductName
            };
        }

        protected override Expression<Func<Drug, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.Or(
                SearchExpressionBuilder.ContainsAny<Drug>(x => x.ProductName.ToLower(), searchTerms),
                SearchExpressionBuilder.ContainsAny<Drug>(x => x.Brand.ToLower(), searchTerms));
        }

        protected override IEnumerable<Drug> PrioritizeItems(
            List<Drug> items,
            string searchText)
        {
            return items;
        }
    }
}
