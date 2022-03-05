using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.Api.Helpers;
using HealthSharingPortal.Api.Storage;
using Microsoft.AspNetCore.Http;

namespace HealthSharingPortal.Api.Controllers
{
    public class PatientNotesController : RestControllerBase<PatientNote>
    {
        public PatientNotesController(
            IStore<PatientNote> store,
            IHttpContextAccessor httpContextAccessor)
            : base(store, httpContextAccessor)
        {
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
    }
}
