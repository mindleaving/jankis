using System.Collections.Generic;
using System.Linq;
using Commons.Extensions;

namespace HealthSharingPortal.API.Models
{
    public class StudyEnrollmentStatistics
    {
        public StudyEnrollmentStatistics(ICollection<StudyEnrollment> enrollments)
        {
            OpenOffers = enrollments.Count(x => x.State.InSet(StudyEnrollementState.ParticipationOffered, StudyEnrollementState.Eligible));
            Enrolled = enrollments.Count(x => x.State == StudyEnrollementState.Enrolled);
            Rejected = enrollments.Count(x => x.State == StudyEnrollementState.Rejected);
            Excluded = enrollments.Count(x => x.State == StudyEnrollementState.Excluded);
            Left = enrollments.Count(x => x.State == StudyEnrollementState.Left);
        }

        public int OpenOffers { get; set; }
        public int Enrolled { get; set; }
        public int Excluded { get; set; }
        public int Rejected { get; set; }
        public int Left { get; set; }
    }
}
