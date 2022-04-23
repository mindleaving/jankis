using System;
using System.Threading.Tasks;
using HealthModels;
using MongoDB.Driver;

namespace HealthSharingPortal.API.Storage
{
    public class GenericStore<T> : GenericReadonlyStore<T>, IStore<T> where T : IId
    {
        public GenericStore(IMongoDatabase mongoDatabase, string collectionName = null)
            : base(mongoDatabase, collectionName)
        {
        }

        public async Task<StorageOperation> StoreAsync(T item)
        {
            if(string.IsNullOrWhiteSpace(item.Id))
                throw new ArgumentException("ID cannot be null or whitespace.", nameof(item.Id));
            var result = await collection.ReplaceOneAsync(x => x.Id == item.Id, item, new ReplaceOptions { IsUpsert = true });
            return result.MatchedCount == 1 ? StorageOperation.Changed : StorageOperation.Created;
        }

        public Task DeleteAsync(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) 
                throw new ArgumentException("Value cannot be null or whitespace.", nameof(id));
            return collection.DeleteOneAsync(x => x.Id == id);
        }
    }
}