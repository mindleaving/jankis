using System;

namespace JanKIS.API.Models
{
    public class PatientNote : IPatientEvent
    {
        public string CreatedBy { get; set; }
        public DateTime Timestamp { get; set; }
        public string Message { get; set; }
    }
}