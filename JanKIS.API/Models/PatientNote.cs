using System;

namespace JanKIS.API.Models
{
    public class PatientNote : IPatientEvent
    {
        public PatientEventType Type => PatientEventType.Note;
        public string PatientId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime Timestamp { get; set; }
        public string Message { get; set; }
    }
}