using System;
using HealthModels.Converters;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace HealthModels.DiagnosticTestResults
{
    [BsonKnownTypes(
        typeof(QuantitativeDiagnosticTestResult),
        typeof(OrdinalDiagnosticTestResult),
        typeof(NominalDiagnosticTestResult),
        typeof(FreetextDiagnosticTestResult),
        typeof(DocumentDiagnosticTestResult),
        typeof(SetDiagnosticTestResult)
    )]
    [JsonConverter(typeof(DiagnosticTestResultJsonConverter))]
    public abstract class DiagnosticTestResult : IDiagnosticTestResult
    {
        public string Id { get; set; }
        public HealthRecordEntryType Type => HealthRecordEntryType.TestResult;
        public string PersonId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime Timestamp { get; set; }
        public string TestCodeLoinc { get; set; }
        public string TestCodeLocal { get; set; }
        public string TestName { get; set; }
        public abstract DiagnosticTestScaleType ScaleType { get; }

    }
}