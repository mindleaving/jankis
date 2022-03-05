using System.IO;
using System.Threading.Tasks;

namespace HealthSharingPortal.Api.Storage
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
