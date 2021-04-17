using System;
using TypescriptGenerator.Attributes;

namespace JanKIS.API.Models
{
    public class PatientNote : IPatientEvent
    {
        public PatientNote(
            string id,
            string patientId,
            string createdBy,
            DateTime timestamp,
            string message,
            string admissionId = null)
        {
            Id = id;
            PatientId = patientId;
            CreatedBy = createdBy;
            Timestamp = timestamp;
            Message = message;
            AdmissionId = admissionId;
        }

        public PatientEventType Type => PatientEventType.Note;
        public string Id { get; set; }
        public string PatientId { get; set; }
        [TypescriptIsOptional]
        public string AdmissionId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime Timestamp { get; set; }
        public string Message { get; set; }
    }
}