using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Interview;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Controllers;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.Workflow;
using HealthSharingPortal.API.Workflow.ViewModelBuilders;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using Microsoft.AspNetCore.Http;

namespace JanKIS.API.Controllers
{
    public class PatientEquipmentController : PersonDataRestControllerBase<AttachedEquipment>
    {
        private readonly IViewModelBuilder<AttachedEquipment> attachedEquipmentViewModelBuilder;
        private readonly INotificationDistributor notificationDistributor;

        public PatientEquipmentController(
            IPersonDataStore<AttachedEquipment> store,
            IHttpContextAccessor httpContextAccessor,
            IViewModelBuilder<AttachedEquipment> attachedEquipmentViewModelBuilder,
            INotificationDistributor notificationDistributor,
            IAuthorizationModule authorizationModule,
            IReadonlyStore<PersonDataChange> changeStore)
            : base(store, httpContextAccessor, authorizationModule, changeStore)
        {
            this.attachedEquipmentViewModelBuilder = attachedEquipmentViewModelBuilder;
            this.notificationDistributor = notificationDistributor;
        }

        protected override async Task<object> TransformItem(
            AttachedEquipment item,
            Language language = Language.en)
        {
            return await attachedEquipmentViewModelBuilder.Build(item);
        }

        protected override Expression<Func<AttachedEquipment, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                _ => x => x.EquipmentType
            };
        }

        protected override Expression<Func<AttachedEquipment, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<AttachedEquipment>(x => x.EquipmentType.ToLower(), searchTerms);
        }

        protected override async Task PublishChange(
            AttachedEquipment item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            await notificationDistributor.NotifyNewPatientEvent(item, storageOperation, submitterUsername);
        }
    }
}
