using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HealthModels.Interview
{
    public class QuestionnaireAnswers : IHealthRecordEntry
    {
        [Required]
        public string Id { get; set; }
        public HealthRecordEntryType Type => HealthRecordEntryType.Questionnaire;
        [Required]
        public string QuestionnaireId { get; set; }
        [Required]
        public string PersonId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedTimestamp { get; set; }
        /// <summary>
        /// Time of answer
        /// </summary>
        [Required]
        public DateTime Timestamp { get; set; }
        public bool IsVerified { get; set; }
        public bool HasBeenSeenBySharer { get; set; }
        [Required]
        public List<QuestionAnswer> Answers { get; set; }
    }
}
