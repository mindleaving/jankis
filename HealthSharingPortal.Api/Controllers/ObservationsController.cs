using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels.Observations;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    public class ObservationsController : RestControllerBase<Observation>
    {
        private readonly IAutocompleteCache autocompleteCache;

        public ObservationsController(
            IStore<Observation> store,
            IAutocompleteCache autocompleteCache,
            IHttpContextAccessor httpContextAccessor)
            : base(store, httpContextAccessor)
        {
            this.autocompleteCache = autocompleteCache;
        }

        public override async Task<IActionResult> CreateOrReplace(
            string id,
            Observation item)
        {
            var measurementTypeAutoCompleteItem = new AutocompleteCacheItem(AutoCompleteContext.MeasurementType.ToString(), item.MeasurementType);
            await autocompleteCache.AddIfNotExists(measurementTypeAutoCompleteItem);
            if (item is GenericObservation genericObservation)
            {
                var unitAutoCompleteItem = new AutocompleteCacheItem(AutoCompleteContext.Unit.ToString(), genericObservation.Unit);
                await autocompleteCache.AddIfNotExists(unitAutoCompleteItem);
            }

            item.CreatedBy = ControllerHelpers.GetUsername(httpContextAccessor);
            item.Timestamp = DateTime.UtcNow;
            return await base.CreateOrReplace(id, item);
        }

        protected override Task<object> TransformItem(Observation item)
        {
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<Observation, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                _ => x => x.Id
            };
        }

        protected override Expression<Func<Observation, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<Observation>(x => x.Id.ToLower(), searchTerms);
        }

        protected override IEnumerable<Observation> PrioritizeItems(
            List<Observation> items,
            string searchText)
        {
            return items;
        }
    }
}
