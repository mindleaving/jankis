using System.Threading.Tasks;
using HealthModels;

namespace IcdAnnotation.API.Data
{
    public interface IStore<T> : IReadonlyStore<T> where T : IId
    {
        Task StoreAsync(T item);
        Task DeleteAsync(string id);
    }
}
