using System.Threading.Tasks;
using HealthModels;

namespace HealthSharingPortal.Api.Storage
{
    public interface IStore<T> : IReadonlyStore<T> where T : IId
    {
        Task<StorageOperation> StoreAsync(T item);
        Task DeleteAsync(string id);
    }
}
