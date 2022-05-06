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

        public Task<List<T>> GetAllAsync(
            string personId,
            List<IPersonDataAccessGrant> accessGrants)
        {
            if(!HasReadPermissionForPerson(personId, accessGrants))
                return Task.FromResult(new List<T>());
            return backingStore.SearchAsync(x => x.PersonId == personId);
        }

        public async Task<bool> ExistsAsync(
            string id,
            List<IPersonDataAccessGrant> accessGrants)
        {
            if (string.IsNullOrWhiteSpace(id)) 
                throw new ArgumentException("ID cannot be null or whitespace.", nameof(id));
            var item = await backingStore.GetByIdAsync(id);
            CheckItemAccessRights(item, accessGrants);
            return item != null;
        }

        public async Task<T> GetByIdAsync(
            string id,
            List<IPersonDataAccessGrant> accessGrants)
        {
            if (string.IsNullOrWhiteSpace(id))
                throw new ArgumentException("ID cannot be null or whitespace.", nameof(id));
            var item = await backingStore.GetByIdAsync(id);
            CheckItemAccessRights(item, accessGrants);
            return item;
        }

        public Task<List<T>> SearchAsync(
            string personId,
            Expression<Func<T, bool>> filter,
            List<IPersonDataAccessGrant> accessGrants,
            int? count = null,
            int? skip = null,
            Expression<Func<T, object>> orderBy = null,
            OrderDirection orderDirection = OrderDirection.Ascending)
        {
            if(!HasReadPermissionForPerson(personId, accessGrants))
                return Task.FromResult(new List<T>());
            filter = SearchExpressionBuilder.And(filter, x => x.PersonId == personId);
            return backingStore.SearchAsync(filter, count, skip, orderBy, orderDirection);
        }

        public Task<T> FirstOrDefaultAsync(
            string personId,
            Expression<Func<T, bool>> filter,
            List<IPersonDataAccessGrant> accessGrants)
        {
            if(!HasReadPermissionForPerson(personId, accessGrants))
                return Task.FromResult(default(T));
            filter = SearchExpressionBuilder.And(filter, x => x.PersonId == personId);
            return backingStore.FirstOrDefaultAsync(filter);
        }

        protected Expression<Func<T, bool>> AddPersonFilter(
            Expression<Func<T, bool>> filter,
            List<IPersonDataAccessGrant> accessGrants)
        {
            if(accessGrants.OfType<ReadAnyPersonDataAccessGrant>().Any())
                return filter;
            if (typeof(T) == typeof(StudyEnrollment) && accessGrants.OfType<StudyEnrollmentStatisticsAccessGrant>().Any())
                return filter;
            var personFilter = CreatePersonFilter(accessGrants);
            return SearchExpressionBuilder.And(filter, personFilter);
        }

        private static Expression<Func<T, bool>> CreatePersonFilter(
            List<IPersonDataAccessGrant> accessGrants)
        {
            var personIds = accessGrants
                .OfType<PersonDataAccessGrant>()
                .Where(x => x.Permissions.Contains(AccessPermissions.Read))
                .Select(x => x.PersonId)
                .ToList();
            if (personIds.Count == 0)
                return x => false;
            return x => personIds.Contains(x.PersonId);
        }

        private void CheckItemAccessRights(
            T item,
            List<IPersonDataAccessGrant> accessGrants)
        {
            if(item == null)
                return;
            if(accessGrants.OfType<ReadAnyPersonDataAccessGrant>().Any())
                return;
            if(typeof(T) == typeof(Account) && accessGrants.OfType<AccountChangeAccessGrant>().Any())
                return;
            if(typeof(T) == typeof(StudyEnrollment) && accessGrants.OfType<StudyEnrollmentStatisticsAccessGrant>().Any())
                return;
            var permissions = GetPermissionsForPerson(item.PersonId, accessGrants);
            if(!permissions.Contains(AccessPermissions.Read))
                throw new SecurityException(SecurityErrorMessage);
        }

        private bool HasReadPermissionForPerson(
            string personId,
            List<IPersonDataAccessGrant> accessGrants)
        {
            if(typeof(T) == typeof(Account) && accessGrants.OfType<AccountChangeAccessGrant>().Any())
                return true;
            if(typeof(T) == typeof(StudyEnrollment) && accessGrants.OfType<StudyEnrollmentStatisticsAccessGrant>().Any())
                return true;
            if(accessGrants.OfType<ReadAnyPersonDataAccessGrant>().Any())
                return true;
            if (GetPermissionsForPerson(personId, accessGrants).Contains(AccessPermissions.Read))
                return true;
            return false;
        }

        protected List<AccessPermissions> GetPermissionsForPerson(
            string personId,
            List<IPersonDataAccessGrant> accessGrants)
        {
            return accessGrants
                .OfType<PersonDataAccessGrant>()
                .Where(x => x.PersonId == personId)
                .SelectMany(x => x.Permissions)
                .Distinct()
                .ToList();
        }
    }
}