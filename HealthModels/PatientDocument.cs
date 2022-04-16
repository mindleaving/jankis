using System;

namespace HealthModels
{
    public class PatientDocument : IHealthRecordEntry
    {
        public string Id { get; set; }
        public HealthRecordEntryType Type => HealthRecordEntryType.Document;
        public string PersonId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime Timestamp { get; set; }
        public bool IsVerified { get; set; }
        public bool HasBeenSeenBySharer { get; set; }
        public string Note { get; set; }
        public string FileName { get; set; }
    }
}
