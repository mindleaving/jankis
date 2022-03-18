using System.Collections.Generic;
using System.Threading.Tasks;
using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.Storage
{
    public interface IStudyEnrollmentReadonlyStore : IReadonlyStore<StudyEnrollment>
    {
        Task<bool> IsEnrolledInAny(IEnumerable<string> studyIds);
    }
}
