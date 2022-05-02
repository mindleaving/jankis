using System;
using HealthModels;
using HealthModels.Interview;

namespace HealthSharingPortal.API.ViewModels
{
    public class QuestionnaireAnswersViewModel : IViewModel<QuestionnaireAnswers>
    {
        public string QuestionnaireId { get; set; }
        public string QuestionnaireTitle { get; set; }
        public string QuestionnaireDescription { get; set; }
        public Language QuestionnaireLanguage { get; set; }
        public int QuestionCount { get; set; }

        public string AnswersId { get; set; }
        public bool HasAnswered { get; set; }
        public DateTime LastChangeTimestamp { get; set; }
        public string AssignedBy { get; set; }
        public DateTime AssignedTimestamp { get; set; }
    }
}