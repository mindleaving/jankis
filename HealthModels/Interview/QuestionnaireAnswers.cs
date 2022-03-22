using System;
using System.Collections.Generic;

namespace HealthModels.Interview
{
    public class QuestionnaireAnswers : IId
    {
        public string Id { get; set; }
        public string QuestionnaireId { get; set; }
        public string PersonId { get; set; }
        public DateTime Timestamp { get; set; }
        public List<QuestionAnswer> Answers { get; set; }
    }
}
