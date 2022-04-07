using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels.Interview;
using HealthModels.Medication;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.Workflow;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    public class MedicationDispensionsController : RestControllerBase<MedicationDispension>
    {
        private readonly INotificationDistributor notificationDistributor;

        public MedicationDispensionsController(
            IStore<MedicationDispension> store,
            IHttpContextAccessor httpContextAccessor,
            INotificationDistributor notificationDistributor)
            : base(store, httpContextAccessor)
        {
            this.notificationDistributor = notificationDistributor;
        }

        public override async Task<IActionResult> CreateOrReplace(string id, MedicationDispension item)
        {
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            item.CreatedBy = username;
            item.Timestamp = DateTime.UtcNow;
            return await base.CreateOrReplace(id, item);
        }

        protected override Task<object> TransformItem(
            MedicationDispension item,
            Language language = Language.en)
        {
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<MedicationDispension, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "patient" => x => x.PersonId,
                "drug" => x => x.Drug.ProductName,
                "time" => x => x.Timestamp,
                _ => x => x.Timestamp
            };
        }

        protected override Expression<Func<MedicationDispension, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<MedicationDispension>(x => x.Drug.ProductName.ToLower(), searchTerms);
        }

        protected override Task PublishChange(
            MedicationDispension item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            return notificationDistributor.NotifyNewPatientEvent(item, storageOperation, submitterUsername);
        }
    }
}
