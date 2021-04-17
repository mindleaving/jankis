using System.IO;
using System.Threading.Tasks;

namespace JanKIS.API.Storage
{
    public interface IFilesStore
    {
        Task StoreAsync(
            string documentId,
            Stream stream);
        Stream GetById(string documentId);
        void Delete(string documentId);
    }
}
