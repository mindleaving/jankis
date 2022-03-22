using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.ViewModels
{
    public class StudyViewModel : IViewModel<Study>
    {
        public Study Study { get; set; }
        public StudyEnrollmentStatistics EnrollmentStatistics { get; set; }
        public StudyAssociation MyAssociation { get; set; }
        public StudyEnrollment MyEnrollment { get; set; }
    }
}
