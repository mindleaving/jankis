using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Interview;
using HealthModels.Procedures;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.Workflow;
using Microsoft.AspNetCore.Http;

namespace HealthSharingPortal.API.Controllers
{
    public class MedicalProceduresController : HealthRecordEntryControllerBase<MedicalProcedure>
    {
        private readonly INotificationDistributor notificationDistributor;

        public MedicalProceduresController(
            IPersonDataStore<MedicalProcedure> store,
            IHttpContextAccessor httpContextAccessor,
            IAuthorizationModule authorizationModule,
            INotificationDistributor notificationDistributor,
            IReadonlyStore<PersonDataChange> changeStore)
            : base(store, httpContextAccessor, authorizationModule, changeStore)
        {
            this.notificationDistributor = notificationDistributor;
        }

        protected override Task<object> TransformItem(
            MedicalProcedure item,
            Language language = Language.en)
        {
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<MedicalProcedure, object>> BuildOrderByExpression(
            string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "code" => x => x.SnomedCtCode,
                "time" => x => x.Timestamp,
                _ => x => x.Id
            };
        }

        protected override Expression<Func<MedicalProcedure, bool>> BuildSearchExpression(
            string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<MedicalProcedure>(x => x.SnomedCtCode, searchTerms);
        }

        protected override Task PublishChange(
            MedicalProcedure item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            return notificationDistributor.NotifyNewPatientEvent(item, storageOperation, submitterUsername);
        }
    }
}
