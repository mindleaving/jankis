using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Interview;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using JanKIS.API.Workflow;
using Microsoft.AspNetCore.Http;

namespace JanKIS.API.Controllers
{
    public class AdmissionsController : RestControllerBase<Admission>
    {
        private readonly INotificationDistributor notificationDistributor;

        public AdmissionsController(
            IStore<Admission> store,
            INotificationDistributor notificationDistributor,
            IHttpContextAccessor httpContextAccessor)
            : base(store, httpContextAccessor)
        {
            this.notificationDistributor = notificationDistributor;
        }

        protected override Task<object> TransformItem(
            Admission item,
            Language language = Language.en)
        {
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<Admission, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "id" => x => x.Id,
                "personid" => x => x.ProfileData.Id,
                _ => x => x.Id
            };
        }

        protected override Expression<Func<Admission, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.Or(
                SearchExpressionBuilder.ContainsAny<Admission>(x => x.ProfileData.FirstName.ToLower(), searchTerms),
                SearchExpressionBuilder.ContainsAny<Admission>(x => x.ProfileData.LastName.ToLower(), searchTerms));

        }

        protected override IEnumerable<Admission> PrioritizeItems(
            List<Admission> items,
            string searchText)
        {
            return items.OrderBy(x => x.Id);
        }

        protected override async Task PublishChange(
            Admission item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            await notificationDistributor.NotifyNewAdmission(item, storageOperation, submitterUsername);
        }
    }
}
