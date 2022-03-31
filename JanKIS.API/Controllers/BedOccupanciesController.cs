using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels.Interview;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using JanKIS.API.Workflow;
using Microsoft.AspNetCore.Http;

namespace JanKIS.API.Controllers
{
    public class BedOccupanciesController : RestControllerBase<BedOccupancy>
    {
        private readonly INotificationDistributor notificationDistributor;

        public BedOccupanciesController(
            IStore<BedOccupancy> store,
            INotificationDistributor notificationDistributor,
            IHttpContextAccessor httpContextAccessor)
            : base(store, httpContextAccessor)
        {
            this.notificationDistributor = notificationDistributor;
        }

        protected override Task<object> TransformItem(
            BedOccupancy item,
            Language language = Language.en)
        {
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<BedOccupancy, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "id" => x => x.Id,
                "department" => x => x.Department.Name,
                "room" => x => x.Room.Name,
                "state" => x => x.State,
                "starttime" => x => x.StartTime,
                "endtime" => x => x.EndTime,
                "patient" => x => x.Patient.LastName,
                _ => x => x.StartTime
            };
        }

        protected override Expression<Func<BedOccupancy, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.Or(
                SearchExpressionBuilder.ContainsAny<BedOccupancy>(x => x.Patient.FirstName.ToLower(), searchTerms),
                SearchExpressionBuilder.ContainsAny<BedOccupancy>(x => x.Patient.LastName.ToLower(), searchTerms),
                SearchExpressionBuilder.ContainsAny<BedOccupancy>(x => x.Room.Name.ToLower(), searchTerms));
        }

        protected override IEnumerable<BedOccupancy> PrioritizeItems(
            List<BedOccupancy> items,
            string searchText)
        {
            return items.OrderBy(x => x.StartTime);
        }

        protected override async Task PublishChange(
            BedOccupancy item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            await notificationDistributor.NotifyNewBedOccupancy(item, storageOperation, submitterUsername);
        }
    }
}
