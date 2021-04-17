using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;

namespace JanKIS.API.Controllers
{
    public class PatientNotesController : RestControllerBase<PatientNote>
    {
        public PatientNotesController(IStore<PatientNote> store)
            : base(store)
        {
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
