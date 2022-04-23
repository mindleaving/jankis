using System;
using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.API.Storage;

namespace HealthSharingPortal.API.Helpers
{
    public static class StorageHelpers
    {
        public static async Task<string> GetUnusedId<T>(this IReadonlyStore<T> store) where T : IId
        {
            do
            {
                var candidate = Guid.NewGuid().ToString();
                var isTaken = await store.ExistsAsync(candidate);
                if (!isTaken)
                    return candidate;
            } while (true);
        }
    }
}
