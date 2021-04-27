using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using JanKIS.API.Workflow;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    public class PatientNotesController : RestControllerBase<PatientNote>
    {
        private readonly INotificationDistributor notificationDistributor;

        public PatientNotesController(
            IStore<PatientNote> store,
            INotificationDistributor notificationDistributor,
            IHttpContextAccessor httpContextAccessor)
            : base(store, httpContextAccessor)
        {
            this.notificationDistributor = notificationDistributor;
        }

        protected override Task<object> TransformItem(PatientNote item)
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

        protected override IEnumerable<PatientNote> PrioritizeItems(
            List<PatientNote> items,
            string searchText)
        {
            return items;
        }

        protected override async Task PublishChange(
            PatientNote item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            await notificationDistributor.NotifyNewPatientEvent(item, storageOperation, submitterUsername);
        }
    }
}
