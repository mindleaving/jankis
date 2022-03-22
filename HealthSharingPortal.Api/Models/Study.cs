using System.Collections.Generic;
using HealthModels;

namespace HealthSharingPortal.API.Models
{
    public class Study : IId
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public List<Publication> Publications { get; set; }
        public List<ResearchStaff> ContactPersons { get; set; }
        public bool IsAcceptingEnrollments { get; set; }
        public string CreatedBy { get; set; }
        public List<string> InclusionCriteriaQuestionaireIds { get; set; }
        public List<string> ExclusionCriteriaQuestionaireIds { get; set; }
    }
}
