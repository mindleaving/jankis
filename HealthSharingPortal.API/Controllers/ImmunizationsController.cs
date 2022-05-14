using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Interview;
using HealthModels.Medication;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.Workflow;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    public class ImmunizationsController : HealthRecordEntryControllerBase<Immunization>
    {
        private readonly INotificationDistributor notificationDistributor;

        public ImmunizationsController(
            IPersonDataStore<Immunization> store,
            IHttpContextAccessor httpContextAccessor,
            IAuthorizationModule authorizationModule,
            IReadonlyStore<PersonDataChange> changeStore,
            INotificationDistributor notificationDistributor)
            : base(store, httpContextAccessor, authorizationModule,
                changeStore)
        {
            this.notificationDistributor = notificationDistributor;
        }

        public override async Task<IActionResult> CreateOrReplace(string id, Immunization item)
        {
            var username = ControllerHelpers.GetAccountId(httpContextAccessor);
            item.CreatedBy = username;
            return await base.CreateOrReplace(id, item);
        }

        protected override Task<object> TransformItem(
            Immunization item,
            Language language = Language.en)
        {
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<Immunization, object>> BuildOrderByExpression(
            string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "patient" => x => x.PersonId,
                "drug" => x => x.Drug.ProductName,
                "time" => x => x.Timestamp,
                _ => x => x.Timestamp
            };
        }

        protected override Expression<Func<Immunization, bool>> BuildSearchExpression(
            string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<Immunization>(x => x.Drug.ProductName.ToLower(), searchTerms);
        }

        protected override Task PublishChange(
            Immunization item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            return notificationDistributor.NotifyNewPatientEvent(item, storageOperation, submitterUsername);
        }
    }
}
