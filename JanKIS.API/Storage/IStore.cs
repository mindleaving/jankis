using System.Threading.Tasks;
using HealthModels;
using JanKIS.API.Models;

namespace JanKIS.API.Storage
{
    public interface IStore<T> : IReadonlyStore<T> where T : IId
    {
        Task<StorageOperation> StoreAsync(T item);
        Task DeleteAsync(string id);
    }
}
