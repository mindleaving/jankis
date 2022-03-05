using System;
using TypescriptGenerator.Attributes;

namespace HealthModels
{
    public class PatientDocument : IPatientEvent
    {
        public string Id { get; set; }
        public PatientEventType Type => PatientEventType.Document;
        public string PatientId { get; set; }
        [TypescriptIsOptional]
        public string AdmissionId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime Timestamp { get; set; }
        public string Note { get; set; }
        public string FileName { get; set; }
    }
}
