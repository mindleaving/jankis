using System;
using System.Collections.Generic;

namespace HealthModels.Interview
{
    public class QuestionnaireAnswers : IHealthRecordEntry
    {
        public string Id { get; set; }
        public HealthRecordEntryType Type => HealthRecordEntryType.Questionnaire;
        public string QuestionnaireId { get; set; }
        public string PersonId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedTimestamp { get; set; }
        /// <summary>
        /// Time of answer
        /// </summary>
        public DateTime Timestamp { get; set; }
        public List<QuestionAnswer> Answers { get; set; }
    }
}
