using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;

namespace JanKIS.API.Controllers
{
    public class DocumentsController : RestControllerBase<PatientDocument>
    {
        public DocumentsController(IStore<PatientDocument> store)
            : base(store)
        {
        }

        protected override Expression<Func<PatientDocument, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                _ => x => x.Id
            };
        }

        protected override Expression<Func<PatientDocument, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<PatientDocument>(x => x.Id.ToLower(), searchTerms);
        }

        protected override IEnumerable<PatientDocument> PrioritizeItems(
            List<PatientDocument> items,
            string searchText)
        {
            return items;
        }
    }
}
