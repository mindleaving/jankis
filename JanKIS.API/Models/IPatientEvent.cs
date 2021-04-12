using System;

namespace JanKIS.API.Models
{
    public interface IPatientEvent
    {
        PatientEventType Type { get; }
        string PatientId { get; set; }
        string CreatedBy { get; set; }
        DateTime Timestamp { get; set; }
    }
}