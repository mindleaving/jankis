using System;
using System.ComponentModel.DataAnnotations;
using TypescriptGenerator.Attributes;

namespace HealthModels.Diagnoses
{
    public class Diagnosis : IHealthRecordEntry
    {
        [Required]
        public string Id { get; set; }
        public HealthRecordEntryType Type => HealthRecordEntryType.Diagnosis;
        [Required]
        public string PersonId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime Timestamp { get; set; }
        public bool IsVerified { get; set; }
        public bool HasBeenSeenBySharer { get; set; }

        [TypescriptIsOptional]
        public string Icd10Code { get; set; }
        [Required]
        public string Icd11Code { get; set; }
        public bool HasResolved { get; set; }
        public DateTime? ResolvedTimestamp { get; set; }
    }
}
