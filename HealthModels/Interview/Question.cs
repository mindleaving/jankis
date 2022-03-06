using System.Collections.Generic;

namespace HealthModels.Interview
{
    public class Question
    {
        public string Text { get; }
        public QuestionResponseType ResponseType { get; }
        
        // For Single/Multiple-choice questions
        public List<string> Options { get; }
        
        // For number questions, can be null if no unit
        public string Unit { get; }
    }
}