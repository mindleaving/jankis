using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.Storage
{
    public interface IStudyEnrollmentStore : IPersonDataStore<StudyEnrollment>
    {
        Task<List<StudyEnrollment>> SearchAsync(
            Expression<Func<StudyEnrollment, bool>> filter,
            List<IPersonDataAccessGrant> accessGrants,
            int? count = null,
            int? skip = null,
            Expression<Func<StudyEnrollment, object>> orderBy = null,
            OrderDirection orderDirection = OrderDirection.Ascending);
        Task<List<StudyEnrollment>> GetAllEnrolledInStudies(
            List<string> studyIds,
            List<IPersonDataAccessGrant> accessGrants);
    }
}
