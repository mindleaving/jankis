using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Security;
using System.Threading.Tasks;
using HealthModels.Diagnoses;
using HealthModels.Interview;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.Workflow;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    public class DiagnosesController : PersonDataRestControllerBase<Diagnosis>
    {
        private readonly INotificationDistributor notificationDistributor;

        public DiagnosesController(
            IPersonDataStore<Diagnosis> store,
            IHttpContextAccessor httpContextAccessor,
            IAuthorizationModule authorizationModule,
            INotificationDistributor notificationDistributor)
            : base(store, httpContextAccessor, authorizationModule)
        {
            this.notificationDistributor = notificationDistributor;
        }

        [HttpPost("{diagnosisId}/resolve")]
        public async Task<IActionResult> MarkAsResolve([FromRoute] string diagnosisId)
        {
            var accessGrants = await GetAccessGrants();
            Diagnosis diagnosis;
            try
            {
                diagnosis = await store.GetByIdAsync(diagnosisId, accessGrants);
            }
            catch (SecurityException)
            {
                return Forbid();
            }
            if (diagnosis == null)
                return NotFound();
            if (diagnosis.HasResolved)
                return Ok();
            diagnosis.HasResolved = true;
            diagnosis.ResolvedTimestamp = DateTime.UtcNow;
            try
            {
                await store.StoreAsync(diagnosis, accessGrants);
            }
            catch (SecurityException)
            {
                Forbid();
            }
            return Ok();
        }


        protected override Task<object> TransformItem(
            Diagnosis item,
            Language language = Language.en)
        {
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<Diagnosis, object>> BuildOrderByExpression(
            string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "icd10" => x => x.Icd10Code,
                "icd11" => x => x.Icd11Code,
                _ => x => x.Id
            };
        }

        protected override Expression<Func<Diagnosis, bool>> BuildSearchExpression(
            string[] searchTerms)
        {
            return SearchExpressionBuilder.Or(
                SearchExpressionBuilder.ContainsAny<Diagnosis>(x => x.Icd11Code.ToLower(), searchTerms),
                SearchExpressionBuilder.ContainsAny<Diagnosis>(x => x.Icd10Code.ToLower(), searchTerms)
            );
        }

        protected override Task PublishChange(
            Diagnosis item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            return notificationDistributor.NotifyNewPatientEvent(item, storageOperation, submitterUsername);
        }
    }
}
