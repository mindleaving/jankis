using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Security;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.AccessControl;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models;
using MongoDB.Driver;

namespace HealthSharingPortal.API.Storage
{
    public class GenericPersonDataReadonlyStore<T> : IPersonDataReadonlyStore<T> where T : IPersonData
    {
        protected const string SecurityErrorMessage = "You do not have the necessary access rights for that person";
        protected readonly GenericReadonlyStore<T> backingStore;

        public GenericPersonDataReadonlyStore(
            IMongoDatabase mongoDatabase,
            string collectionName = null)
        {
            backingStore = new GenericReadonlyStore<T>(mongoDatabase, collectionName, bypassPersonDataTypeCheck: true);
        }

        public Task<List<T>> GetAllAsync(List<PersonDataAccessGrant> accessGrants)
        {
            return backingStore.SearchAsync(CreatePersonFilter(accessGrants));
        }

        public async Task<bool> ExistsAsync(
            string id,
            List<PersonDataAccessGrant> accessGrants)
        {
            var item = await backingStore.GetByIdAsync(id);
            CheckItemAccessRights(item, accessGrants);
            return item != null;
        }

        public async Task<T> GetByIdAsync(
            string id,
            List<PersonDataAccessGrant> accessGrants)
        {
            var item = await backingStore.GetByIdAsync(id);
            CheckItemAccessRights(item, accessGrants);
            return item;
        }

        public Task<List<T>> SearchAsync(
            Expression<Func<T, bool>> filter,
            List<PersonDataAccessGrant> accessGrants,
            int? count = null,
            int? skip = null,
            Expression<Func<T, object>> orderBy = null,
            OrderDirection orderDirection = OrderDirection.Ascending)
        {
            filter = AddPersonFilter(filter, accessGrants);
            return backingStore.SearchAsync(filter, count, skip, orderBy, orderDirection);
        }

        public Task<T> FirstOrDefaultAsync(
            Expression<Func<T, bool>> filter,
            List<PersonDataAccessGrant> accessGrants)
        {
            filter = AddPersonFilter(filter, accessGrants);
            return backingStore.FirstOrDefaultAsync(filter);
        }

        private Expression<Func<T, bool>> AddPersonFilter(
            Expression<Func<T, bool>> filter,
            List<PersonDataAccessGrant> accessGrants)
        {
            if (typeof(T) == typeof(StudyEnrollment) && accessGrants.OfType<StudyEnrollmentStatisticsAccessGrant>().Any())
                return filter;
            var personFilter = CreatePersonFilter(accessGrants);
            return SearchExpressionBuilder.And(filter, personFilter);
        }

        private static Expression<Func<T, bool>> CreatePersonFilter(
            List<PersonDataAccessGrant> accessGrants)
        {
            var personIds = accessGrants.Where(x => x.Permissions.Contains(AccessPermissions.Read)).Select(x => x.PersonId).ToList();
            Expression<Func<T, bool>> personFilter = x => personIds.Contains(x.PersonId);
            return personFilter;
        }

        private void CheckItemAccessRights(
            T item,
            List<PersonDataAccessGrant> accessGrants)
        {
            if(item == null)
                return;
            var personAccessGrant = accessGrants.Find(x => x.PersonId == item.PersonId);
            if(personAccessGrant == null || !personAccessGrant.Permissions.Contains(AccessPermissions.Read))
                throw new SecurityException(SecurityErrorMessage);
        }
    }
}