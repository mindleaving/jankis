using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Interview;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.Workflow;
using Microsoft.AspNetCore.Http;

namespace HealthSharingPortal.API.Controllers
{
    public class NotesController : HealthRecordEntryControllerBase<PatientNote>
    {
        private readonly INotificationDistributor notificationDistributor;

        public NotesController(
            IPersonDataStore<PatientNote> store,
            IHttpContextAccessor httpContextAccessor,
            IAuthorizationModule authorizationModule,
            IReadonlyStore<PersonDataChange> changeStore,
            INotificationDistributor notificationDistributor)
            : base(store, httpContextAccessor, authorizationModule, changeStore)
        {
            this.notificationDistributor = notificationDistributor;
        }

        protected override Task<object> TransformItem(
            PatientNote item,
            Language language = Language.en)
        {
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<PatientNote, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                _ => x => x.Id
            };
        }

        protected override Expression<Func<PatientNote, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<PatientNote>(x => x.Id.ToLower(), searchTerms);
        }

        protected override Task PublishChange(
            PatientNote item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            return notificationDistributor.NotifyNewPatientEvent(item, storageOperation, submitterUsername);
        }
    }
}
