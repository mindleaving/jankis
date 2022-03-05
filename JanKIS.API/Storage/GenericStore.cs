using System.Threading.Tasks;
using HealthModels;
using JanKIS.API.Models;
using MongoDB.Driver;

namespace JanKIS.API.Storage
{
    public class GenericStore<T> : GenericReadonlyStore<T>, IStore<T> where T : IId
    {
        public GenericStore(IMongoDatabase mongoDatabase)
            : base(mongoDatabase)
        {
        }

        public async Task<StorageOperation> StoreAsync(T item)
        {
            var result = await collection.ReplaceOneAsync(x => x.Id == item.Id, item, new ReplaceOptions { IsUpsert = true });
            return result.MatchedCount == 1 ? StorageOperation.Changed : StorageOperation.Created;
        }

        public Task DeleteAsync(string id)
        {
            return collection.DeleteOneAsync(x => x.Id == id);
        }
    }
}