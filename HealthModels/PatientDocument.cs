using System;
using System.ComponentModel.DataAnnotations;

namespace HealthModels
{
    public class PatientDocument : IHealthRecordEntry
    {
        [Required]
        public string Id { get; set; }
        public HealthRecordEntryType Type => HealthRecordEntryType.Document;
        [Required]
        public string PersonId { get; set; }
        public string CreatedBy { get; set; }
        [Required]
        public DateTime Timestamp { get; set; }
        public bool IsVerified { get; set; }
        public bool HasBeenSeenBySharer { get; set; }
        public string Note { get; set; }
        public string FileName { get; set; }
    }
}
