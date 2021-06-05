using System.Threading.Tasks;
using JanKIS.API.AccessManagement;
using JanKIS.API.Models;

namespace JanKIS.API.Storage
{
    public interface IStore<T> : IReadonlyStore<T> where T : IId
    {
        Task<StorageOperation> StoreAsync(T item, PermissionFilter<T> permissionFilter);
        Task DeleteAsync(string id, PermissionFilter<T> permissionFilter);
    }
}
