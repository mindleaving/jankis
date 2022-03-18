using System;
using System.ComponentModel.DataAnnotations;
using TypescriptGenerator.Attributes;

namespace HealthModels.Medication
{
    public class MedicationDispension : IHealthRecordEntry
    {
        public MedicationDispension(
            string id,
            string personId,
            string createdBy,
            DateTime timestamp,
            Drug drug,
            string unit,
            double value,
            string note = null)
        {
            Id = id;
            PersonId = personId;
            CreatedBy = createdBy;
            Timestamp = timestamp;
            Drug = drug;
            Unit = unit;
            Value = value;
            Note = note;
        }

        public string Id { get; set; }
        public HealthRecordEntryType Type => HealthRecordEntryType.MedicationDispension;
        public string PersonId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime Timestamp { get; set; }

        [Required]
        public Drug Drug { get; set; }
        [Required]
        public string Unit { get; set; }
        [Required]
        public double Value { get; set; }
        public MedicationDispensionState State { get; set; }
        [TypescriptIsOptional]
        public string Note { get; set; }
        
    }
}