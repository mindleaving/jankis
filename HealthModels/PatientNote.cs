using System;
using System.ComponentModel.DataAnnotations;

namespace HealthModels
{
    public class PatientNote : IHealthRecordEntry
    {
        public PatientNote(
            string id,
            string personId,
            string createdBy,
            DateTime timestamp,
            string message)
        {
            Id = id;
            PersonId = personId;
            CreatedBy = createdBy;
            Timestamp = timestamp;
            Message = message;
        }

        public HealthRecordEntryType Type => HealthRecordEntryType.Note;
        [Required]
        public string Id { get; set; }
        [Required]
        public string PersonId { get; set; }
        public string CreatedBy { get; set; }
        [Required]
        public DateTime Timestamp { get; set; }
        public bool IsVerified { get; set; }
        public bool HasBeenSeenBySharer { get; set; }
        public string Message { get; set; }
    }
}