using System;
using System.ComponentModel.DataAnnotations;

namespace HealthModels.Procedures
{
    public class MedicalProcedure : IHealthRecordEntry
    {
        public string Id { get; set; }
        public string PersonId { get; set; }
        public HealthRecordEntryType Type => HealthRecordEntryType.Procedure;
        public string CreatedBy { get; set; }
        public DateTime Timestamp { get; set; }
        public bool IsVerified { get; set; }
        public bool HasBeenSeenBySharer { get; set; }

        [Required]
        public string SnomedCtCode { get; set; }
        public string SnomedCtName { get; set; }
        public string Note { get; set; }
    }
}
