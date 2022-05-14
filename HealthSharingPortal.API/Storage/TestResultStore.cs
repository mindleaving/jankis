using System.Threading.Tasks;
using HealthModels;
using HealthModels.DiagnosticTestResults;
using MongoDB.Driver;

namespace HealthSharingPortal.API.Storage
{
    public class TestResultStore : GenericPersonDataStore<DiagnosticTestResult>, ITestResultStore
    {
        public TestResultStore(
            IMongoDatabase mongoDatabase,
            IStore<PersonDataChange> recordChangeStore,
            string collectionName = null)
            : base(mongoDatabase, recordChangeStore, collectionName)
        {
        }

        public Task<bool> HasTestResultsDependentOnDocument(
            string documentId)
        {
            return collection
                .OfType<DocumentDiagnosticTestResult>()
                .Find(x => x.DocumentId == documentId)
                .AnyAsync();
        }
    }
}
