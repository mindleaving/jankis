using System.Collections.Generic;

namespace JanKIS.API.Models
{
    public class MedicationSchedule
    {
        public string PatientId { get; set; }
        public List<MedicationScheduleItem> Items { get; set; }
        public string Note { get; set; }
    }
}