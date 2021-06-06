using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using Microsoft.AspNetCore.Http;

namespace JanKIS.API.Controllers
{
    public class DiagnosticTestsController : RestControllerBase<DiagnosticTestDefinition>
    {
        public DiagnosticTestsController(IStore<DiagnosticTestDefinition> store, IHttpContextAccessor httpContextAccessor)
            : base(store, httpContextAccessor)
        {
        }

        protected override Task<object> TransformItem(DiagnosticTestDefinition item)
        {
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<DiagnosticTestDefinition, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "name" => x => x.Name,
                "loinc" => x => x.TestCodeLoinc,
                "local" => x => x.TestCodeLocal,
                "scale" => x => x.ScaleType,
                _ => x => x.Name
            };
        }

        protected override Expression<Func<DiagnosticTestDefinition, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.Or(
                SearchExpressionBuilder.ContainsAll<DiagnosticTestDefinition>(x => x.Name.ToLower(), searchTerms),
                SearchExpressionBuilder.ContainsAll<DiagnosticTestDefinition>(x => x.TestCodeLoinc.ToLower(), searchTerms),
                SearchExpressionBuilder.ContainsAll<DiagnosticTestDefinition>(x => x.TestCodeLocal.ToLower(), searchTerms));
        }

        protected override IEnumerable<DiagnosticTestDefinition> PrioritizeItems(List<DiagnosticTestDefinition> items, string searchText)
        {
            return items.OrderBy(x => x.Name.Length);
        }

        protected override Task PublishChange(DiagnosticTestDefinition item, StorageOperation storageOperation, string submitterUsername)
        {
            // Nothing to do
            return Task.CompletedTask;
        }
    }
}
