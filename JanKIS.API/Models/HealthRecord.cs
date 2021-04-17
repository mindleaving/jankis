using System.Collections.Generic;

namespace JanKIS.API.Models
{
    public class HealthRecord
    {
        public string PersonId { get; set; }
        public List<Admission> Admissions { get; set; }
        public List<Observation> Observations { get; set; }
        public List<DiagnosticTestResult> TestResults { get; set; }
        public List<PatientNote> Notes { get; set; }
        public List<PatientDocument> Documents { get; set; }
    }
}
