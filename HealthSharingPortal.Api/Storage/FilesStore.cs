using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;

namespace HealthSharingPortal.Api.Storage
{
    public class FilesStore : IFilesStore
    {
        private readonly string directory;

        public FilesStore(IOptions<FileStoreOptions> options)
        {
            directory = options.Value.Directory;
            if (!Directory.Exists(directory))
                Directory.CreateDirectory(directory);
        }

        public async Task StoreAsync(string documentId, Stream stream)
        {
            var filePath = GetFilePath(documentId);
            await using var fileStream = File.OpenWrite(filePath);
            await stream.CopyToAsync(fileStream);
        }

        public Stream GetById(string documentId)
        {
            var filePath = GetFilePath(documentId);
            return File.OpenRead(filePath);
        }

        public void Delete(string documentId)
        {
            var filePath = GetFilePath(documentId);
            File.Delete(filePath);
        }

        private string GetFilePath(string documentId)
        {
            return Path.Combine(directory, documentId);
        }
    }

    public class FileStoreOptions
    {
        public const string AppSettingsSectionName = "FileStore";

        public string Directory { get; set; }
    }
}
