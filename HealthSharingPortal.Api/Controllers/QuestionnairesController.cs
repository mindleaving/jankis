using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels.Interview;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.Workflow;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    public class QuestionnairesController : PersonDataRestControllerBase<Questionnaire>
    {
        private readonly IStore<QuestionnaireAnswers> answersStore;

        public QuestionnairesController(
            IStore<Questionnaire> store,
            IHttpContextAccessor httpContextAccessor,
            IStore<QuestionnaireAnswers> answersStore,
            IAuthorizationModule authorizationModule)
            : base(store, httpContextAccessor, authorizationModule)
        {
            this.answersStore = answersStore;
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

        [HttpPost("{questionnaireId}/answers")]
        [HttpPut("{questionnaireId}/answers/{answerId}")]
        public async Task<IActionResult> SubmitAnswer(
            [FromRoute] string questionnaireId, 
            [FromRoute] string answerId, 
            [FromBody] QuestionnaireAnswers answer)
        {
            if (answer.QuestionnaireId != questionnaireId)
                return BadRequest("Questionnaire ID of body doesn't match route");
            if (answerId != null && answer.Id != answerId)
                return BadRequest("Answer ID of body doesn't match route");
            var existingAnswer = await answersStore.GetByIdAsync(answer.Id);
            if (existingAnswer != null)
            {
                if (existingAnswer.PersonId != answer.PersonId)
                    return Conflict("An answer with the same ID exists for another person");
                if (existingAnswer.QuestionnaireId != questionnaireId)
                    return Conflict("An answer with the same ID exists for another questionnaire. Please use another ID");
            }
            var isAuthorized = await IsAuthorizedToAccessPerson(answer.PersonId);
            if (!isAuthorized)
                return Forbid("You are not authorized to submit answers for this person");
            
            await answersStore.StoreAsync(answer);
            return Ok();
        }


        [HttpGet("{questionnaireId}/answers/{answerId}")]
        public async Task<IActionResult> GetAnswer(
            [FromRoute] string questionnaireId,
            [FromRoute] string answerId)
        {
            var answer = await answersStore.GetByIdAsync(answerId);
            if (answer == null)
                return NotFound();
            if (answer.QuestionnaireId != questionnaireId)
                return NotFound();
            var isAuthorized = await IsAuthorizedToAccessPerson(answer.PersonId);
            if (!isAuthorized)
                return Forbid();
            return Ok(answer);
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
