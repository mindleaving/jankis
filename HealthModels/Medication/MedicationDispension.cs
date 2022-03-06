using System;
using System.ComponentModel.DataAnnotations;
using TypescriptGenerator.Attributes;

namespace HealthModels.Medication
{
    public class MedicationDispension : IPatientEvent
    {
        public MedicationDispension(
            string id,
            string patientId,
            string createdBy,
            DateTime timestamp,
            Drug drug,
            string unit,
            double value,
            string admissionId = null,
            string note = null)
        {
            Id = id;
            PatientId = patientId;
            CreatedBy = createdBy;
            Timestamp = timestamp;
            Drug = drug;
            Unit = unit;
            Value = value;
            AdmissionId = admissionId;
            Note = note;
        }

        public string Id { get; set; }
        public PatientEventType Type => PatientEventType.MedicationDispension;
        public string PatientId { get; set; }
        [TypescriptIsOptional]
        public string AdmissionId { get; set; }
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