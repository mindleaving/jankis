using System.Threading.Tasks;
using HealthModels.DiagnosticTestResults;

namespace HealthSharingPortal.API.Storage
{
    public interface ITestResultStore : IPersonDataStore<DiagnosticTestResult>
    {
        Task<bool> HasTestResultsDependentOnDocument(string documentId);
    }
}