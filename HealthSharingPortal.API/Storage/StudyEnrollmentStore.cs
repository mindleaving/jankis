using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Models;
using MongoDB.Driver;

namespace HealthSharingPortal.API.Storage
{
    public class StudyEnrollmentStore : GenericPersonDataStore<StudyEnrollment>, IStudyEnrollmentStore
    {
        public StudyEnrollmentStore(
            IMongoDatabase mongoDatabase,
            IStore<PersonDataChange> recordChangeStore,
            string collectionName = null)
            : base(mongoDatabase, recordChangeStore, collectionName)
        {
        }

        public Task<List<StudyEnrollment>> SearchAsync(
            Expression<Func<StudyEnrollment, bool>> filter,
            List<IPersonDataAccessGrant> accessGrants,
            int? count = null,
            int? skip = null,
            Expression<Func<StudyEnrollment, object>> orderBy = null,
            OrderDirection orderDirection = OrderDirection.Ascending)
        {
            return backingStore.SearchAsync(
                AddPersonFilter(filter, accessGrants),
                count,
                skip,
                orderBy,
                orderDirection);
        }

        public Task<List<StudyEnrollment>> GetAllEnrolledInStudies(
            List<string> studyIds,
            List<IPersonDataAccessGrant> accessGrants)
        {
            var filter = AddPersonFilter(
                x => studyIds.Contains(x.StudyId) && x.State == StudyEnrollementState.Enrolled,
                accessGrants);
            return collection.Find(filter).ToListAsync();
        }
    }
}