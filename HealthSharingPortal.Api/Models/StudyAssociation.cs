using HealthModels;

namespace HealthSharingPortal.API.Models
{
    public class StudyAssociation : IId
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string StudyId { get; set; }
        public StudyStaffRole Role { get; set; }
    }
}
