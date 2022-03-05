using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HealthModels;
using MongoDB.Driver;

namespace JanKIS.API.Storage
{
    public class GenericCachedReadonlyStore<T> : GenericReadonlyStore<T>, ICachedReadonlyStore<T> where T : IId
    {
        private readonly ConcurrentDictionary<string, T> cachedItems = new();
        private bool hasAllItems = false;

        public GenericCachedReadonlyStore(IMongoDatabase mongoDatabase)
            : base(mongoDatabase)
        {
        }

        public async Task<List<T>> CachedGetAllAsync()
        {
            if (hasAllItems)
            {
                return cachedItems.Values.ToList();
            }

            var items = await GetAllAsync();
            foreach (var item in items)
            {
                cachedItems.TryAdd(item.Id, item);
            }
            hasAllItems = true;
            return items;
        }

        public async Task<T> CachedGetByIdAsync(string id)
        {
            if (cachedItems.TryGetValue(id, out var item))
                return item;
            item = await GetByIdAsync(id);
            if (item != null)
            {
                if (hasAllItems) // Item wasn't cached but in the database, hence we clearly do no longer have all items cached
                    hasAllItems = false;
                cachedItems.TryAdd(id, item);
            }
            return item;
        }
    }
}