using System;
using MongoDB.Bson.Serialization.Attributes;

namespace JanKIS.API.Models
{
    [BsonKnownTypes(
        typeof(QuantitativeDiagnosticTestResult),
        typeof(OrdinalDiagnosticTestResult),
        typeof(OrdinalOrQuantitativeDiagnosticTestResult),
        typeof(NominalDiagnosticTestResult),
        typeof(FreetextDiagnosticTestResult),
        typeof(DocumentDiagnosticTestResult),
        typeof(SetDiagnosticTestResult)
    )]
    public abstract class DiagnosticTestResult : IDiagnosticTestResult
    {
        public string CreatedBy { get; set; }
        public DateTime Timestamp { get; set; }
        public string TestCodeLoinc { get; set; }
        public string TestCodeLocal { get; set; }
        public string TestName { get; set; }
        public abstract DiagnosticTestScaleType ScaleType { get; }
    }
}