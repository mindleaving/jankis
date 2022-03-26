using HealthModels.Services;
using JanKIS.API.Models;
using MongoDB.Driver;
using NUnit.Framework;
using SharedTools;

namespace JanKIS.Tools
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
                testDefinition.Audience.Add(new RoleServiceAudience { RoleId = SystemRoles.Doctor.Id });
                diagnosticTestCollection.InsertOne(testDefinition);
            }
        }
    }
}
