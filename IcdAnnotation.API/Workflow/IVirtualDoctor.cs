using System.Collections.Generic;
using HealthModels.Interview;
using IcdAnnotation.API.Models;

namespace IcdAnnotation.API.Workflow
{
    public interface IVirtualDoctor
    {
        List<Question> AskQuestions(Patient patient, Language language);
    }
}