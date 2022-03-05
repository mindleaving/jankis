using System.Collections.Generic;
using System.Threading.Tasks;
using HealthSharingPortal.Api.Models;

namespace HealthSharingPortal.Api.Storage
{
    public interface IAutocompleteCache
    {
        Task AddIfNotExists(AutocompleteCacheItem cacheItem);
        Task<List<string>> GetSuggestions(string context, string searchText, int? count);
    }
}
