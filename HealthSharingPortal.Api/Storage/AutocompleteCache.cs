using System.Collections.Generic;
using System.Threading.Tasks;
using HealthSharingPortal.Api.Models;
using MongoDB.Driver;

namespace HealthSharingPortal.Api.Storage
{
    public class AutocompleteCache : IAutocompleteCache
    {
        private readonly IMongoDatabase mongoDatabase;
        private readonly IMongoCollection<AutocompleteCacheItem> cacheItems;

        public AutocompleteCache(IMongoDatabase mongoDatabase)
        {
            this.mongoDatabase = mongoDatabase;
            cacheItems = mongoDatabase.GetCollection<AutocompleteCacheItem>(nameof(AutocompleteCacheItem));
        }

        public async Task AddIfNotExists(AutocompleteCacheItem cacheItem)
        {
            if(string.IsNullOrWhiteSpace(cacheItem.Value))
                return;
            var exists = await cacheItems.Find(
                x => x.Context.ToLower() == cacheItem.Context.ToLower() 
                    && x.Value == cacheItem.Value)
                .AnyAsync();
            if (exists)
                return;
            await cacheItems.InsertOneAsync(cacheItem);
        }

        public Task<List<string>> GetSuggestions(
            string context,
            string searchText,
            int? count)
        {
            return cacheItems
                .Find(x => x.Context.ToLower() == context.ToLower() && x.Value.ToLower().Contains(searchText.ToLower()))
                .Limit(count)
                .Project(x => x.Value)
                .ToListAsync();
        }
    }
}