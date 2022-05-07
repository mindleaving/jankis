using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HealthModels.Interview;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.ViewModels;

namespace HealthSharingPortal.API.Workflow.ViewModelBuilders
{
    public class QuestionnaireAnswersViewModelBuilder : IViewModelBuilder<QuestionnaireAnswers>
    {
        private readonly IReadonlyStore<Questionnaire> questionnaireStore;

        public QuestionnaireAnswersViewModelBuilder(
            IReadonlyStore<Questionnaire> questionnaireStore)
        {
            this.questionnaireStore = questionnaireStore;
        }

        public async Task<IViewModel<QuestionnaireAnswers>> Build(
            QuestionnaireAnswers model,
            IViewModelBuilderOptions<QuestionnaireAnswers> options = null)
        {
            var questionnaire = await questionnaireStore.GetByIdAsync(model.QuestionnaireId);
            return BuildViewModel(model, questionnaire);
        }

        private static IViewModel<QuestionnaireAnswers> BuildViewModel(
            QuestionnaireAnswers model,
            Questionnaire questionnaire)
        {
            return new QuestionnaireAnswersViewModel
            {
                Id = model.Id,
                PersonId = model.PersonId,
                Timestamp = model.Timestamp,
                CreatedBy = model.CreatedBy,
                Answers = model.Answers ?? new List<QuestionAnswer>(),
                IsVerified = model.IsVerified,
                HasBeenSeenBySharer = model.HasBeenSeenBySharer,
                CreatedTimestamp = model.CreatedTimestamp,
                HasAnswered = model.Answers.Any(),
                QuestionCount = questionnaire.Questions.Count,
                QuestionnaireId = questionnaire.Id,
                QuestionnaireTitle = questionnaire.Title,
                QuestionnaireDescription = questionnaire.Description,
                QuestionnaireLanguage = questionnaire.Language
            };
        }

        public async Task<List<IViewModel<QuestionnaireAnswers>>> BatchBuild(
            List<QuestionnaireAnswers> models,
            IViewModelBuilderOptions<QuestionnaireAnswers> options = null)
        {
            if (models.Count == 0)
                return new List<IViewModel<QuestionnaireAnswers>>();
            var questionnaireIds = models.Select(x => x.QuestionnaireId).Distinct().ToList();
            var questionnaires = (await questionnaireStore.SearchAsync(x => questionnaireIds.Contains(x.Id)))
                .ToDictionary(x => x.Id);
            return models
                .Select(model => BuildViewModel(model, questionnaires[model.QuestionnaireId]))
                .ToList();
        }
    }
}
