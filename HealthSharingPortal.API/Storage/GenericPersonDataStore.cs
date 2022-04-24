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
        protected readonly IMongoCollection<T> collection;
        protected readonly IStore<PersonDataChange> recordChangeStore;

        public GenericPersonDataStore(
            IMongoDatabase mongoDatabase,
            IStore<PersonDataChange> recordChangeStore,
            string collectionName = null)
            : base(mongoDatabase, collectionName)
        {
            this.recordChangeStore = recordChangeStore;
            collection = mongoDatabase.GetCollection<T>(collectionName ?? typeof(T).Name);
        }

        public async Task<StorageOperation> StoreAsync(
            T item,
            List<IPersonDataAccessGrant> accessGrants,
            PersonDataChangeMetadata changedBy)
        {
            if(string.IsNullOrWhiteSpace(item.Id))
                throw new ArgumentException("ID cannot be null or whitespace.", nameof(item.Id));
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
                await LogRecordChange(item.Id, changedBy, StorageOperation.Changed);
                await collection.ReplaceOneAsync(x => x.Id == item.Id, item, new ReplaceOptions { IsUpsert = false });
                return StorageOperation.Changed;
            }
            await LogRecordChange(item.Id, changedBy, StorageOperation.Created);
            await collection.InsertOneAsync(item);
            return StorageOperation.Created;
        }

        public async Task DeleteAsync(
            string id,
            List<IPersonDataAccessGrant> accessGrants,
            PersonDataChangeMetadata changedBy)
        {
            if (string.IsNullOrWhiteSpace(id))
                throw new ArgumentException("ID cannot be null or whitespace.", nameof(id));
            var item = await collection.Find(x => x.Id == id).FirstOrDefaultAsync();
            if(item == null)
                return;
            var permissions = GetPermissionsForPerson(item.PersonId, accessGrants);
            if (!permissions.Contains(AccessPermissions.Modify))
                throw new SecurityException("You do not have the necessary access rights for that person");
            await LogRecordChange(id, changedBy, StorageOperation.Deleted);
            await collection.DeleteOneAsync(x => x.Id == id);
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

        protected async Task LogRecordChange(
            string entryId,
            PersonDataChangeMetadata changedBy,
            StorageOperation operation)
        {
            await recordChangeStore.StoreAsync(
                new PersonDataChange
                {
                    Id = Guid.NewGuid().ToString(),
                    Type = typeof(T).Name,
                    EntryId = entryId,
                    ChangedByAccountId = changedBy.AccountId,
                    ChangedByPersonId = changedBy.PersonId,
                    Timestamp = DateTime.UtcNow,
                    ChangeType = operation
                });
        }
    }
}