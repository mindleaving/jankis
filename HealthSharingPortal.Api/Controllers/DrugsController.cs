using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Interview;
using HealthModels.Medication;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using Microsoft.AspNetCore.Http;

namespace HealthSharingPortal.API.Controllers
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

        protected override Task<object> TransformItem(
            Drug item,
            Language language = Language.en)
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

        protected override async Task PublishChange(
            Drug item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            await autocompleteCache.AddIfNotExists(new AutocompleteCacheItem(AutoCompleteContext.DrugBrand.ToString(), item.Brand));
            await autocompleteCache.AddIfNotExists(new AutocompleteCacheItem(AutoCompleteContext.DrugApplicationSite.ToString(), item.ApplicationSite));
            await autocompleteCache.AddIfNotExists(new AutocompleteCacheItem(AutoCompleteContext.DrugDispensionForm.ToString(), item.DispensionForm));
            await autocompleteCache.AddIfNotExists(new AutocompleteCacheItem(AutoCompleteContext.Unit.ToString(), item.AmountUnit));
            foreach (var activeIngredient in item.ActiveIngredients)
            {
                await autocompleteCache.AddIfNotExists(new AutocompleteCacheItem(AutoCompleteContext.DrugActiveIngredient.ToString(), activeIngredient));
            }
        }
    }
}
