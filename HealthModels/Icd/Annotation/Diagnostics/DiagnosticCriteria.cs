using HealthModels.Converters;
using HealthModels.DiagnosticTestResults;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace HealthModels.Icd.Annotation.Diagnostics
{
    [JsonConverter(typeof(DiagnosticCriteriaJsonConverter))]
    [BsonKnownTypes(
        typeof(DocumentDiagnosticCriteria),
        typeof(FreetextDiagnosticCriteria),
        typeof(NominalDiagnosticCriteria),
        typeof(OrdinalDiagnosticCriteria),
        typeof(OrdinalQuantativeDiagnosticCriteria),
        typeof(QuantativeDiagnosticCriteria),
        typeof(SetDiagnosticCriteria)
    )]
    public abstract class DiagnosticCriteria : IDiagnosticCriteria
    {
        public string DiagnosticTestLoincCode { get; set; }
        public string DiagnosticTestName { get; set; }
        public abstract DiagnosticTestScaleType ScaleType { get; }
    }
}