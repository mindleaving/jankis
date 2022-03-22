using System.Collections.Generic;
using HealthModels.Interview;
using HealthSharingPortal.API.Models;
using Newtonsoft.Json.Linq;

namespace HealthSharingPortal.API.ViewModels
{
    public class StudyParticipationOfferViewModel
    {
        public Study Study { get; set; }
        public List<Questionnaire> InclusionCriteriaQuestionnaires { get; set; }
        public List<QuestionnaireSchema> InclusionCriteriaSchemas { get; set; }
        public List<QuestionnaireAnswers> InclusionCriteriaAnswers { get; set; }

        public List<Questionnaire> ExclusionCriteriaQuestionnaires { get; set; }
        public List<QuestionnaireSchema> ExclusionCriteriaSchemas { get; set; }
        public List<QuestionnaireAnswers> ExclusionCriteriaAnswers { get; set; }
    }

    public class QuestionnaireSchema
    {
        public string QuestionnaireId { get; set; }
        public JObject Schema { get; set; }
    }
}
