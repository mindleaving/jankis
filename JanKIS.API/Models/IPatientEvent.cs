using System;

namespace JanKIS.API.Models
{
    public interface IPatientEvent
    {
        //PatientEventType EventType { get; }
        string CreatedBy { get; set; }
        DateTime Timestamp { get; set; }
    }
}