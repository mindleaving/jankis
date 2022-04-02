﻿using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels.DiagnosticTestResults;
using HealthModels.Interview;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.Workflow;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    public class TestResultsController : PersonDataRestControllerBase<DiagnosticTestResult>
    {
        private readonly IAutocompleteCache autocompleteCache;
        private readonly INotificationDistributor notificationDistributor;

        public TestResultsController(
            IStore<DiagnosticTestResult> store,
            IAutocompleteCache autocompleteCache,
            IHttpContextAccessor httpContextAccessor,
            IAuthorizationModule authorizationModule,
            INotificationDistributor notificationDistributor)
            : base(store, httpContextAccessor, authorizationModule)
        {
            this.autocompleteCache = autocompleteCache;
            this.notificationDistributor = notificationDistributor;
        }

        public override async Task<IActionResult> CreateOrReplace(string id, DiagnosticTestResult item)
        {
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            item.CreatedBy = username;
            item.Timestamp = DateTime.UtcNow;
            return await base.CreateOrReplace(id, item);
        }

        protected override Task<object> TransformItem(
            DiagnosticTestResult item,
            Language language = Language.en)
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

        protected override async Task PublishChange(
            DiagnosticTestResult item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            switch (item)
            {
                case QuantitativeDiagnosticTestResult quantativeTestResult:
                {
                    var context = AutoCompleteContextGenerator.GetAutoCompleteContextForDiagnosticTestUnit(item.TestCodeLoinc ?? item.TestCodeLocal);
                    await autocompleteCache.AddIfNotExists(new AutocompleteCacheItem(context, quantativeTestResult.Unit));
                    break;
                }
                case NominalDiagnosticTestResult nominalTestResult:
                {
                    var context = AutoCompleteContextGenerator.GetAutoCompleteContextForDiagnosticTestOptions(item.TestCodeLoinc ?? item.TestCodeLocal);
                    await autocompleteCache.AddIfNotExists(new AutocompleteCacheItem(context, nominalTestResult.Value));
                    break;
                }
                case OrdinalDiagnosticTestResult ordinalTestResult:
                {
                    var context = AutoCompleteContextGenerator.GetAutoCompleteContextForDiagnosticTestOptions(item.TestCodeLoinc ?? item.TestCodeLocal);
                    await autocompleteCache.AddIfNotExists(new AutocompleteCacheItem(context, ordinalTestResult.Value));
                    break;
                }
            }

            await notificationDistributor.NotifyNewPatientEvent(item, storageOperation, submitterUsername);
        }
    }
}
