using System;

namespace HealthModels
{
    public class PersonDataChange : IId
    {
        public string Id { get; set; }
        public string Type { get; set; }
        public string EntryId { get; set; }
        public string ChangedByAccountId { get; set; }
        public string ChangedByPersonId { get; set; }
        public DateTime Timestamp { get; set; }
        public StorageOperation ChangeType { get; set; }
    }
}
