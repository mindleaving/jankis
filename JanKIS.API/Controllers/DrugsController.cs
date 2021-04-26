using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using Microsoft.AspNetCore.Http;

namespace JanKIS.API.Controllers
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

        protected override async Task PublishChange(
            Drug item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            await autocompleteCache.AddIfNotExists(new AutocompleteCacheItem(AutoCompleteContext.DrugBrand.ToString(), item.Brand));
            await autocompleteCache.AddIfNotExists(new AutocompleteCacheItem(AutoCompleteContext.DrugApplicationSite.ToString(), item.ApplicationSite));
            await autocompleteCache.AddIfNotExists(new AutocompleteCacheItem(AutoCompleteContext.DrugDispensionForm.ToString(), item.DispensionForm));
            foreach (var activeIngredient in item.ActiveIngredients)
            {
                await autocompleteCache.AddIfNotExists(new AutocompleteCacheItem(AutoCompleteContext.DrugActiveIngredient.ToString(), activeIngredient));
            }
        }
    }
}
