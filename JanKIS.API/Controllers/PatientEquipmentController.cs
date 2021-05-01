using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using JanKIS.API.ViewModels.Builders;
using JanKIS.API.Workflow;
using Microsoft.AspNetCore.Http;

namespace JanKIS.API.Controllers
{
    public class PatientEquipmentController : RestControllerBase<AttachedEquipment>
    {
        private readonly IViewModelBuilder<AttachedEquipment> attachedEquipmentViewModelBuilder;
        private readonly INotificationDistributor notificationDistributor;

        public PatientEquipmentController(
            IStore<AttachedEquipment> store,
            IHttpContextAccessor httpContextAccessor,
            IViewModelBuilder<AttachedEquipment> attachedEquipmentViewModelBuilder,
            INotificationDistributor notificationDistributor)
            : base(store, httpContextAccessor)
        {
            this.attachedEquipmentViewModelBuilder = attachedEquipmentViewModelBuilder;
            this.notificationDistributor = notificationDistributor;
        }

        protected override async Task<object> TransformItem(AttachedEquipment item)
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

        protected override IEnumerable<AttachedEquipment> PrioritizeItems(
            List<AttachedEquipment> items,
            string searchText)
        {
            return items;
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
