using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Interview;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.Workflow;
using HealthSharingPortal.API.Workflow.ViewModelBuilders;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    public class QuestionnairesController : RestControllerBase<Questionnaire>
    {
        private readonly IPersonDataStore<QuestionnaireAnswers> answersStore;
        private readonly IAuthorizationModule authorizationModule;
        private readonly IViewModelBuilder<QuestionnaireAnswers> questionnaireAnswersViewModelBuilder;

        public QuestionnairesController(
            IStore<Questionnaire> store,
            IHttpContextAccessor httpContextAccessor,
            IPersonDataStore<QuestionnaireAnswers> answersStore,
            IAuthorizationModule authorizationModule,
            IViewModelBuilder<QuestionnaireAnswers> questionnaireAnswersViewModelBuilder)
            : base(store, httpContextAccessor)
        {
            this.answersStore = answersStore;
            this.authorizationModule = authorizationModule;
            this.questionnaireAnswersViewModelBuilder = questionnaireAnswersViewModelBuilder;
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
            var accessGrants = await GetAccessGrants();
            if (answer.QuestionnaireId != questionnaireId)
                return BadRequest("Questionnaire ID of body doesn't match route");
            if (answerId != null && answer.Id != answerId)
                return BadRequest("Answer ID of body doesn't match route");
            var existingAnswer = await answersStore.GetByIdAsync(answer.Id, accessGrants);
            if (existingAnswer != null)
            {
                if (existingAnswer.PersonId != answer.PersonId)
                    return Conflict("An answer with the same ID exists for another person");
                if (existingAnswer.QuestionnaireId != questionnaireId)
                    return Conflict("An answer with the same ID exists for another questionnaire. Please use another ID");
            }

            await PersonDataControllerHelpers.Store(
                answersStore,
                answer,
                accessGrants,
                httpContextAccessor);
            var answerVM = await TransformItem(answer);
            return Ok(answerVM);
        }

        [HttpGet("{questionnaireId}/answers/{answerId}")]
        public async Task<IActionResult> GetAnswer(
            [FromRoute] string questionnaireId,
            [FromRoute] string answerId)
        {
            var accessGrants = await GetAccessGrants();
            var answer = await answersStore.GetByIdAsync(answerId, accessGrants);
            if (answer == null)
                return NotFound();
            if (answer.QuestionnaireId != questionnaireId)
                return NotFound();
            var answerVM = await TransformItem(answer);
            return Ok(answerVM);
        }

        private async Task<List<IPersonDataAccessGrant>> GetAccessGrants()
        {
            var claims = ControllerHelpers.GetClaims(httpContextAccessor);
            var accessGrants = await authorizationModule.GetAccessGrants(claims);
            return accessGrants;
        }

        protected async Task<object> TransformItem(
            QuestionnaireAnswers item,
            Language language = Language.en)
        {
            return await questionnaireAnswersViewModelBuilder.Build(item);
        }

        protected override Task<object> TransformItem(
            Questionnaire item,
            Language language = Language.en)
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

        protected override Task PublishChange(
            Questionnaire item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            // Nothing to do
            return Task.CompletedTask;
        }
    }
}
