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
    public class PersonStore : GenericPersonDataStore<Person>, IPersonStore
    {
        public PersonStore(
            IMongoDatabase mongoDatabase,
            IStore<PersonDataChange> recordChangeStore,
            string collectionName = null)
            : base(mongoDatabase, recordChangeStore, collectionName)
        {
        }

        public Task<List<Person>> SearchAsync(
            Expression<Func<Person, bool>> filter,
            List<IPersonDataAccessGrant> accessGrants,
            int? count = null,
            int? skip = null,
            Expression<Func<Person, object>> orderBy = null,
            OrderDirection orderDirection = OrderDirection.Ascending)
        {
            return backingStore.SearchAsync(AddPersonFilter(filter, accessGrants), count, skip, orderBy, orderDirection);
        }

        public Task<List<Person>> SearchByName(
            string firstName,
            string lastName,
            List<IPersonDataAccessGrant> accessGrants)
        {
            return SearchAsync(x => x.FirstName.ToLower() == firstName.ToLower() && x.LastName.ToLower() == lastName.ToLower(), accessGrants);
        }
    }
}