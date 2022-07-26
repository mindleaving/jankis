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
using Microsoft.AspNetCore.Mvc;

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

        [HttpGet("immunizations")]
        public async Task<IActionResult> GetImmunizations(
            [FromQuery] string searchText,
            [FromQuery] int? count = null,
            [FromQuery] int? skip = 0,
            [FromQuery] string orderBy = null,
            [FromQuery] OrderDirection orderDirection = OrderDirection.Ascending,
            [FromQuery] Language language = Language.en)
        {
            Expression<Func<Drug, bool>> searchExpression;
            if(!string.IsNullOrWhiteSpace(searchText))
            {
                var searchTerms = SearchTermSplitter.SplitAndToLower(searchText);
                searchExpression = BuildSearchExpression(searchTerms);
            }
            else
            {
                searchExpression = x => true;
            }
            searchExpression = SearchExpressionBuilder.And(searchExpression, x => x.Type == DrugType.Immunization);
            var orderByExpression = BuildOrderByExpression(orderBy);
            var items = await store.SearchAsync(searchExpression, count, skip, orderByExpression, orderDirection);
            var transformedItems = await TransformItems(items, language);
            return Ok(transformedItems);
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
            foreach (var pathogen in item.ProtectsAgainst)
            {
                await autocompleteCache.AddIfNotExists(new AutocompleteCacheItem(AutoCompleteContext.ImmunizationPathogen.ToString(), pathogen));
            }
        }
    }
}
