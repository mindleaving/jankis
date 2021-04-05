using System.Collections.Generic;
using JanKIS.API.Storage;

namespace JanKIS.API.Models
{
    public class Admission : IId
    {
        public string Id { get; set; }
        public string PatientId { get; set; }
        public HealthInsurance HealthInsurance { get; set; }
        public AdmissionInfo AdmissionInfo { get; set; }
        public bool IsReadmission { get; set; }
        public MedicationSchedule MedicationSchedule { get; set; }
        public List<AttachedEquipment> AttachedEquipment { get; }
        public List<Observation> Observations { get; set; }
        public List<DiagnosticTestResult> DiagnosticTestResults { get; set; }
        public List<PatientNote> Notes { get; set; }
        public DischargeInfo DischargeInfo { get; set; }
        public List<PersonReference> ContactPersons { get; }
    }
}