using System;
using JanKIS.API.Storage;
using TypescriptGenerator.Attributes;

namespace JanKIS.API.Models
{
    public interface IPatientEvent : IId
    {
        PatientEventType Type { get; }
        string PatientId { get; set; }
        [TypescriptIsOptional]
        string AdmissionId { get; set; }
        string CreatedBy { get; set; }
        DateTime Timestamp { get; set; }
    }
}