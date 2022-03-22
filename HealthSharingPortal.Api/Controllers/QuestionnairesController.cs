using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels.Interview;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.Workflow;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    public class QuestionnairesController : RestControllerBase<Questionnaire>
    {
        public QuestionnairesController(
            IStore<Questionnaire> store,
            IHttpContextAccessor httpContextAccessor)
            : base(store, httpContextAccessor)
        {
        }

        [HttpGet("{id}/schema")]
        public async Task<IActionResult> Schema([FromRoute] string id)
        {
            var item = await store.GetByIdAsync(id);
            if(item == null)
                return NotFound();
            var questionnaireToSchemaConverter = new QuestionaireToSchemaConverter();
            var schema = questionnaireToSchemaConverter.Convert(item);
            return Ok(schema);
        }


        protected override Task<object> TransformItem(
            Questionnaire item)
        {
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<Questionnaire, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                _ => x => x.Id
            };
        }

        protected override Expression<Func<Questionnaire, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.Or(
                SearchExpressionBuilder.ContainsAny<Questionnaire>(x => x.Title.ToLower(), searchTerms),
                SearchExpressionBuilder.ContainsAny<Questionnaire>(x => x.Description.ToLower(), searchTerms)
            );
        }

        protected override IEnumerable<Questionnaire> PrioritizeItems(List<Questionnaire> items, string searchText)
        {
            return items;
        }
    }
}
