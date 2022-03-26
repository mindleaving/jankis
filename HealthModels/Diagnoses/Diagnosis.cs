using System;
using TypescriptGenerator.Attributes;

namespace HealthModels.Diagnoses
{
    public class Diagnosis : IHealthRecordEntry
    {
        public string Id { get; set; }
        public HealthRecordEntryType Type => HealthRecordEntryType.Diagnosis;
        public string PersonId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime Timestamp { get; set; }

        [TypescriptIsOptional]
        public string Icd10Code { get; set; }
        public string Icd11Code { get; set; }
        public bool HasResolved { get; set; }
        public DateTime? ResolvedTimestamp { get; set; }
    }
}
