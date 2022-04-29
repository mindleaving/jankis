using System;
using HealthModels.Medication;

namespace HealthSharingPortal.API.ViewModels
{
    public class DispenseMedicationViewModel 
    {
        public string ScheduleId { get; set; }
        public string ItemId { get; set; }
        public string DispensionId { get; set; }
        public MedicationDispensionState DispensionState { get; set; }
        public DateTime? AdministrationTime { get; set; }
        public string AdministeredBy { get; set; }
        public string Note { get; set; }
        public MedicationDosage AdministeredAmount { get; set; }
    }
}
