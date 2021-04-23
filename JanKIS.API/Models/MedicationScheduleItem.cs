using System.Collections.Generic;

namespace JanKIS.API.Models
{
    public class MedicationScheduleItem
    {
        public Drug Drug { get; set; }
        public List<MedicationDispension> Dispensions { get; set; }
        public string Note { get; set; }
        public bool IsPaused { get; set; }
        public bool IsDispendedByPatient { get; set; }
    }
}
