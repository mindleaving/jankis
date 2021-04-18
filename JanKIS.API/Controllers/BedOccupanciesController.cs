using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;

namespace JanKIS.API.Controllers
{
    public class BedOccupanciesController : RestControllerBase<BedOccupancy>
    {
        public BedOccupanciesController(IStore<BedOccupancy> store)
            : base(store)
        {
        }

        protected override Expression<Func<BedOccupancy, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "id" => x => x.Id,
                "department" => x => x.DepartmentId,
                "room" => x => x.RoomId,
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
                SearchExpressionBuilder.ContainsAny<BedOccupancy>(x => x.RoomId.ToLower(), searchTerms));
        }

        protected override IEnumerable<BedOccupancy> PrioritizeItems(
            List<BedOccupancy> items,
            string searchText)
        {
            return items.OrderBy(x => x.StartTime);
        }
    }
}
