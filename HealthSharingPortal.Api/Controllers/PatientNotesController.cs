﻿using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Interview;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Storage;
using Microsoft.AspNetCore.Http;

namespace HealthSharingPortal.API.Controllers
{
    public class PatientNotesController : PersonDataRestControllerBase<PatientNote>
    {
        public PatientNotesController(
            IStore<PatientNote> store,
            IHttpContextAccessor httpContextAccessor,
            IAuthorizationModule authorizationModule)
            : base(store, httpContextAccessor, authorizationModule)
        {
        }

        protected override Task<object> TransformItem(
            PatientNote item,
            Language language)
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
