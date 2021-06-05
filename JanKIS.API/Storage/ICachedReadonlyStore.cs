using System.Collections.Generic;
using System.Threading.Tasks;
using JanKIS.API.AccessManagement;

namespace JanKIS.API.Storage
{
    public interface ICachedReadonlyStore<T> : IReadonlyStore<T> where T : IId
    {
        Task<List<T>> CachedGetAllAsync(PermissionFilter<T> permissionFilter);
        Task<T> CachedGetByIdAsync(string id, PermissionFilter<T> permissionFilter);
    }
}