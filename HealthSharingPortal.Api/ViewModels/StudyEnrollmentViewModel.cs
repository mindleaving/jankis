using HealthModels;
using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.ViewModels
{
    public class StudyEnrollmentViewModel : IViewModel<StudyEnrollment>
    {
        public StudyEnrollment Enrollment { get; set; }
        public Person Person { get; set; }
    }
}
