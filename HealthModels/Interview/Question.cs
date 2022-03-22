using System.Collections.Generic;

namespace HealthModels.Interview
{
    public class Question : IId
    {
        public string Id { get; set; }

        /// <summary>
        /// Two-letter ISO 639-1 code indicating the language of the question
        /// </summary>
        public string Language { get; set; }
        public bool IsRequired { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public QuestionResponseType ResponseType { get; set; }
        
        // For Single/Multiple-choice questions
        public List<string> Options { get; set; }
        
        // For number questions, can be null if no unit
        public string Unit { get; set; }
    }
}