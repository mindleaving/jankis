using System.Collections.Generic;
using System.Threading.Tasks;
using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.Storage
{
    public interface IAutocompleteCache
    {
        Task AddIfNotExists(AutocompleteCacheItem cacheItem);
        Task<List<string>> GetSuggestions(string context, string searchText, int? count);
    }
}
