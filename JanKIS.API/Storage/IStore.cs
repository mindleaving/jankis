using System.Threading.Tasks;

namespace JanKIS.API.Storage
{
    public interface IStore<T> : IReadonlyStore<T> where T : IId
    {
        Task StoreAsync(T item);
        Task DeleteAsync(string id);
    }
}
