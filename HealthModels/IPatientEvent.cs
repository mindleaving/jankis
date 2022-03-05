using System;
using System.ComponentModel.DataAnnotations;
using TypescriptGenerator.Attributes;

namespace HealthModels
{
    public interface IPatientEvent : IId
    {
        [Required]
        PatientEventType Type { get; }
        [Required]
        string PatientId { get; set; }
        [TypescriptIsOptional]
        string AdmissionId { get; set; }
        string CreatedBy { get; set; }
        DateTime Timestamp { get; set; }
    }
}