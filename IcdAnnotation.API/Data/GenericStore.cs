using System.Threading.Tasks;
using HealthModels;
using MongoDB.Driver;

namespace IcdAnnotation.API.Data
{
    public class GenericStore<T> : GenericReadonlyStore<T>, IStore<T> where T : IId
    {
        public GenericStore(IMongoDatabase mongoDatabase)
            : base(mongoDatabase)
        {
        }

        public Task StoreAsync(T item)
        {
            return collection.ReplaceOneAsync(x => x.Id == item.Id, item, new ReplaceOptions { IsUpsert = true });
        }

        public Task DeleteAsync(string id)
        {
            return collection.DeleteOneAsync(x => x.Id == id);
        }
    }
}