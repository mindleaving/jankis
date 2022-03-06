using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Observations;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using JanKIS.API.Workflow;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    public class ObservationsController : RestControllerBase<Observation>
    {
        private readonly IAutocompleteCache autocompleteCache;
        private readonly INotificationDistributor notificationDistributor;

        public ObservationsController(
            IStore<Observation> store,
            IAutocompleteCache autocompleteCache,
            IHttpContextAccessor httpContextAccessor,
            INotificationDistributor notificationDistributor)
            : base(store, httpContextAccessor)
        {
            this.autocompleteCache = autocompleteCache;
            this.notificationDistributor = notificationDistributor;
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

        protected override async Task PublishChange(
            Observation item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            await notificationDistributor.NotifyNewPatientEvent(item, storageOperation, submitterUsername);
        }
    }
}
