using System.Collections.Generic;
using JanKIS.API.Storage;

namespace JanKIS.API.Models
{
    public class MedicationScheduleItem : IId
    {
        public string Id { get; set; }
        public Drug Drug { get; set; }
        public List<MedicationDispension> Dispensions { get; set; }
        public string Note { get; set; }
        public bool IsPaused { get; set; }
        public bool IsDispendedByPatient { get; set; }
    }
}
