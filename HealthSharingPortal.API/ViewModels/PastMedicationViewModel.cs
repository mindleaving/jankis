using System;
using HealthModels.Medication;
using TypescriptGenerator.Attributes;

namespace HealthSharingPortal.API.ViewModels
{
    public class PastMedicationViewModel
    {
        public string PersonId { get; set; }
        public Drug Drug { get; set; }
        public string CreatedBy { get; set; }
        [TypescriptIsOptional]
        public string AdministeredBy { get; set; }
        public MedicationDosage Dosage { get; set; }
        public DateTime StartTimestamp { get; set; }
        public DateTime EndTimestamp { get; set; }
        public MedicationSchedulePattern Pattern { get; set; }
    }
}
