using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Diagnoses;
using HealthModels.Interview;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.Workflow;
using HealthSharingPortal.API.Workflow.ViewModelBuilders;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    public class DiagnosesController : HealthRecordEntryControllerBase<Diagnosis>
    {
        private readonly INotificationDistributor notificationDistributor;
        private readonly IViewModelBuilder<Diagnosis> viewModelBuilder;

        public DiagnosesController(
            IPersonDataStore<Diagnosis> store,
            IHttpContextAccessor httpContextAccessor,
            IAuthorizationModule authorizationModule,
            IReadonlyStore<PersonDataChange> changeStore,
            INotificationDistributor notificationDistributor,
            IViewModelBuilder<Diagnosis> viewModelBuilder)
            : base(store, httpContextAccessor, authorizationModule, changeStore)
        {
            this.notificationDistributor = notificationDistributor;
            this.viewModelBuilder = viewModelBuilder;
        }

        [HttpPost("{diagnosisId}/resolve")]
        public async Task<IActionResult> MarkAsResolve([FromRoute] string diagnosisId)
        {
            var accessGrants = await GetAccessGrants();
            var diagnosis = await store.GetByIdAsync(diagnosisId, accessGrants);
            if (diagnosis == null)
                return NotFound();
            if (diagnosis.HasResolved)
                return Ok();
            diagnosis.HasResolved = true;
            diagnosis.ResolvedTimestamp = DateTime.UtcNow;
            await Store(store, diagnosis, accessGrants);
            return Ok();
        }


        protected override async Task<object> TransformItem(
            Diagnosis item,
            Language language = Language.en)
        {
            return await viewModelBuilder.Build(item);
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
