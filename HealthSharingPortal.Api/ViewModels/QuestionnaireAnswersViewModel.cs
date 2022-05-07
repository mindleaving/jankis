using System;
using HealthModels.Interview;

namespace HealthSharingPortal.API.ViewModels
{
    public class QuestionnaireAnswersViewModel : QuestionnaireAnswers, IViewModel<QuestionnaireAnswers>
    {
        public string QuestionnaireTitle { get; set; }
        public string QuestionnaireDescription { get; set; }
        public Language QuestionnaireLanguage { get; set; }
        public int QuestionCount { get; set; }
        public bool HasAnswered { get; set; }
    }
}