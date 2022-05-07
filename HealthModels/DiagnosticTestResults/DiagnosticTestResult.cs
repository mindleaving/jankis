using System;
using System.ComponentModel.DataAnnotations;
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
        [Required]
        public string Id { get; set; }
        public HealthRecordEntryType Type => HealthRecordEntryType.TestResult;
        [Required]
        public string PersonId { get; set; }
        public string CreatedBy { get; set; }
        [Required]
        public DateTime Timestamp { get; set; }
        public bool IsVerified { get; set; }
        public bool HasBeenSeenBySharer { get; set; }
        [Required]
        public string TestCodeLoinc { get; set; }
        public string TestCodeLocal { get; set; }
        [Required]
        public string TestName { get; set; }
        public string TestCategory { get; set; }
        [Required]
        public abstract DiagnosticTestScaleType ScaleType { get; }

    }
}