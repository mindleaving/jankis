using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;

namespace JanKIS.API.Controllers
{
    public class AdmissionsController : RestControllerBase<Admission>
    {
        public AdmissionsController(IStore<Admission> store)
            : base(store)
        {
        }

        protected override Expression<Func<Admission, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "id" => x => x.Id,
                "patientid" => x => x.PatientId,
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
    }
}
