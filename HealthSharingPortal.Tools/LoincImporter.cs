using HealthModels.Services;
using HealthSharingPortal.API.Models;
using MongoDB.Driver;
using NUnit.Framework;
using SharedTools;

namespace HealthSharingPortal.Tools
{
    public class LoincImporter : DatabaseAccess
    {
        private IMongoCollection<DiagnosticTestDefinition> diagnosticTestCollection;

        [OneTimeSetUp]
        public void Setup()
        {
            diagnosticTestCollection = GetCollection<DiagnosticTestDefinition>(nameof(DiagnosticTestDefinition));
        }

        [Test]
        public void ImportLoincCodes()
        {
            var filePath = @"F:\Projects\DoctorsTodo\Loinc.csv";
            var loincCsvFileParser = new LoincCsvFileParser();
            foreach (var testDefinition in loincCsvFileParser.Parse(filePath))
            {
                testDefinition.Audience.Add(new RoleServiceAudience { RoleId = AccountType.HealthProfessional.ToString() });
                testDefinition.Audience.Add(new RoleServiceAudience { RoleId = AccountType.Researcher.ToString() });
                diagnosticTestCollection.InsertOne(testDefinition);
            }
        }
    }
}
