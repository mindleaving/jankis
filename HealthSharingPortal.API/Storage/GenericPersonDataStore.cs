using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.AccessControl;
using HealthSharingPortal.API.AccessControl;
using MongoDB.Driver;

namespace HealthSharingPortal.API.Storage
{
    public class GenericPersonDataStore<T> : GenericPersonDataReadonlyStore<T>, IPersonDataStore<T> where T : IPersonData
    {
        private readonly IMongoCollection<T> collection;

        public GenericPersonDataStore(IMongoDatabase mongoDatabase, string collectionName = null)
            : base(mongoDatabase, collectionName)
        {
            collection = mongoDatabase.GetCollection<T>(collectionName ?? typeof(T).Name);
        }

        public async Task<StorageOperation> StoreAsync(T item, List<PersonDataAccessGrant> accessGrants)
        {
            var permissions = GetPermissionsForPerson(item.PersonId, accessGrants);
            if(!permissions.Contains(AccessPermissions.Create) && !permissions.Contains(AccessPermissions.Modify))
                throw new SecurityException(SecurityErrorMessage);
            var existingItem = await collection.Find(x => x.Id == item.Id).FirstOrDefaultAsync();
            if (existingItem != null)
            {
                if(existingItem.PersonId != item.PersonId)
                    throw new InvalidOperationException("An item with the same ID but for a different person already exists, please choose a different ID");
                if(!permissions.Contains(AccessPermissions.Modify))
                    throw new SecurityException(SecurityErrorMessage);
                await collection.ReplaceOneAsync(x => x.Id == item.Id, item, new ReplaceOptions { IsUpsert = false });
                return StorageOperation.Changed;
            }
            await collection.InsertOneAsync(item);
            return StorageOperation.Created;
        }

        public async Task DeleteAsync(string id, List<PersonDataAccessGrant> accessGrants)
        {
            var item = await collection.Find(x => x.Id == id).FirstOrDefaultAsync();
            if(item == null)
                return;
            var permissions = GetPermissionsForPerson(item.PersonId, accessGrants);
            if (!permissions.Contains(AccessPermissions.Modify))
                throw new SecurityException("You do not have the necessary access rights for that person");
            await collection.DeleteOneAsync(x => x.Id == id);
        }

        private List<AccessPermissions> GetPermissionsForPerson(
            string personId,
            List<PersonDataAccessGrant> accessGrants)
        {
            return accessGrants
                .Where(x => x.PersonId == personId)
                .SelectMany(x => x.Permissions)
                .Distinct()
                .ToList();
        }
    }
}