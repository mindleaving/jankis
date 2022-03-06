using System;
using System.Collections.Generic;
using HealthModels.Interview;
using IcdAnnotation.API.Models;

namespace IcdAnnotation.API.Workflow
{
    public class VirtualDoctor : IVirtualDoctor
    {
        public List<Question> AskQuestions(Patient patient, Language language)
        {
            // TODO: This is where all the magic starts!
            throw new NotImplementedException();
        }
    }
}
