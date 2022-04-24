using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Extensions;
using HealthModels.Interview;
using HealthModels.Procedures;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Storage;
using Microsoft.AspNetCore.Http;

namespace HealthSharingPortal.API.Controllers
{
    public class MedicalProcedureDefinitionsController : RestControllerBase<MedicalProcedureDefinition>
    {
        public MedicalProcedureDefinitionsController(
            IStore<MedicalProcedureDefinition> store, 
            IHttpContextAccessor httpContextAccessor)
            : base(store, httpContextAccessor)
        {
        }

        protected override Task<object> TransformItem(
            MedicalProcedureDefinition item,
            Language language = Language.en)
        {
            item.Translate(language);
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<MedicalProcedureDefinition, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "name" => x => x.Name,
                "snomed" => x => x.SnomedCtCode,
                "local" => x => x.LocalCode,
                _ => x => x.Name
            };
        }

        protected override Expression<Func<MedicalProcedureDefinition, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.Or(
                SearchExpressionBuilder.ContainsAll<MedicalProcedureDefinition>(x => x.Name.ToLower(), searchTerms),
                SearchExpressionBuilder.ContainsAll<MedicalProcedureDefinition>(x => x.SnomedCtCode.ToLower(), searchTerms),
                SearchExpressionBuilder.ContainsAll<MedicalProcedureDefinition>(x => x.LocalCode.ToLower(), searchTerms));
        }

        protected override Task PublishChange(
            MedicalProcedureDefinition item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            // Nothing to do
            return Task.CompletedTask;
        }
    }
}