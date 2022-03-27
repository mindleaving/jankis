using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels.Services;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Storage;
using Microsoft.AspNetCore.Http;

namespace HealthSharingPortal.API.Controllers
{
    public class DiagnosticTestsController : PersonDataRestControllerBase<DiagnosticTestDefinition>
    {
        public DiagnosticTestsController(
            IStore<DiagnosticTestDefinition> store, 
            IHttpContextAccessor httpContextAccessor,
            IAuthorizationModule authorizationModule)
            : base(store, httpContextAccessor, authorizationModule)
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
    }
}
