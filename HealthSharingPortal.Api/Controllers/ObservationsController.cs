using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels.Interview;
using HealthModels.Observations;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.Workflow;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    public class ObservationsController : PersonDataRestControllerBase<Observation>
    {
        private readonly IAutocompleteCache autocompleteCache;
        private readonly INotificationDistributor notificationDistributor;

        public ObservationsController(
            IPersonDataStore<Observation> store,
            IAutocompleteCache autocompleteCache,
            IHttpContextAccessor httpContextAccessor,
            IAuthorizationModule authorizationModule,
            INotificationDistributor notificationDistributor)
            : base(store, httpContextAccessor, authorizationModule)
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

        protected override Task<object> TransformItem(
            Observation item,
            Language language = Language.en)
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

        protected override Task PublishChange(
            Observation item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            return notificationDistributor.NotifyNewPatientEvent(item, storageOperation, submitterUsername);
        }
    }
}
