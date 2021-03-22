using System.Threading.Tasks;
using MongoDB.Driver;

namespace JanKIS.API.Storage
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