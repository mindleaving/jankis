using System.Linq;
using System.Threading.Tasks;
using HealthModels.DiagnosticTestResults;
using HealthModels.Services;
using MongoDB.Driver;
using NUnit.Framework;

namespace HealthSharingPortal.Tools
{
    public class DatabaseUpdates : DatabaseAccess
    {
        [Test]
        public async Task AssignCategoryToTestResults()
        {
            var testResultCollection = GetCollection<DiagnosticTestResult>();
            var testDefinitionCollection = GetCollection<DiagnosticTestDefinition>();
            var testResults = await testResultCollection.Find(x => true).ToListAsync();
            var loincCodes = testResults.Select(x => x.TestCodeLoinc).Distinct().ToList();
            var testDefinitions = await testDefinitionCollection.Find(x => loincCodes.Contains(x.TestCodeLoinc)).ToListAsync();
            foreach (var testDefinition in testDefinitions)
            {
                await testResultCollection.UpdateManyAsync(
                    x => x.TestCodeLoinc == testDefinition.TestCodeLoinc,
                    Builders<DiagnosticTestResult>.Update.Set(x => x.TestCategory, testDefinition.Category));
            }
        }
    }
}
