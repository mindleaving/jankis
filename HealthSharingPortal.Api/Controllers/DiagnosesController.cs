using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels.Diagnoses;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Storage;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    public class DiagnosesController : PersonDataRestControllerBase<Diagnosis>
    {
        private readonly IAuthorizationModule authorizationModule;

        public DiagnosesController(
            IStore<Diagnosis> store,
            IHttpContextAccessor httpContextAccessor,
            IAuthorizationModule authorizationModule)
            : base(store, httpContextAccessor, authorizationModule)
        {
            this.authorizationModule = authorizationModule;
        }

        [HttpPost("{diagnosisId}/resolve")]
        public async Task<IActionResult> MarkAsResolve([FromRoute] string diagnosisId)
        {
            var diagnosis = await store.GetByIdAsync(diagnosisId);
            if (diagnosis == null)
                return NotFound();
            if (diagnosis.HasResolved)
                return Ok();
            var isAuthorized = await IsAuthorizedToAccessPerson(diagnosis.PersonId);
            if (!isAuthorized)
                return Forbid();
            diagnosis.HasResolved = true;
            diagnosis.ResolvedTimestamp = DateTime.UtcNow;
            await store.StoreAsync(diagnosis);
            return Ok();
        }


        protected override Task<object> TransformItem(
            Diagnosis item)
        {
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<Diagnosis, object>> BuildOrderByExpression(
            string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "icd10" => x => x.Icd10Code,
                "icd11" => x => x.Icd11Code,
                _ => x => x.Id
            };
        }

        protected override Expression<Func<Diagnosis, bool>> BuildSearchExpression(
            string[] searchTerms)
        {
            return SearchExpressionBuilder.Or(
                SearchExpressionBuilder.ContainsAny<Diagnosis>(x => x.Icd11Code.ToLower(), searchTerms),
                SearchExpressionBuilder.ContainsAny<Diagnosis>(x => x.Icd10Code.ToLower(), searchTerms)
            );
        }

        protected override IEnumerable<Diagnosis> PrioritizeItems(
            List<Diagnosis> items,
            string searchText)
        {
            return items;
        }
    }
}
