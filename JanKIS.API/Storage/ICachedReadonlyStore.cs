using System.Collections.Generic;
using System.Threading.Tasks;

namespace JanKIS.API.Storage
{
    public interface ICachedReadonlyStore<T> : IReadonlyStore<T> where T : IId
    {
        Task<List<T>> CachedGetAllAsync();
        Task<T> CachedGetByIdAsync(string id);
    }
}