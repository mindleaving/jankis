using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels.DiagnosticTestResults;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Storage;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    public class TestResultsController : PersonDataRestControllerBase<DiagnosticTestResult>
    {
        private readonly IAutocompleteCache autocompleteCache;

        public TestResultsController(
            IStore<DiagnosticTestResult> store,
            IAutocompleteCache autocompleteCache,
            IHttpContextAccessor httpContextAccessor,
            IAuthorizationModule authorizationModule)
            : base(store, httpContextAccessor, authorizationModule)
        {
            this.autocompleteCache = autocompleteCache;
        }

        public override async Task<IActionResult> CreateOrReplace(string id, DiagnosticTestResult item)
        {
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            item.CreatedBy = username;
            item.Timestamp = DateTime.UtcNow;
            return await base.CreateOrReplace(id, item);
        }

        protected override Task<object> TransformItem(DiagnosticTestResult item)
        {
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<DiagnosticTestResult, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                _ => x => x.Id
            };
        }

        protected override Expression<Func<DiagnosticTestResult, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<DiagnosticTestResult>(x => x.Id.ToLower(), searchTerms);
        }

        protected override IEnumerable<DiagnosticTestResult> PrioritizeItems(
            List<DiagnosticTestResult> items,
            string searchText)
        {
            return items;
        }
    }
}
