using System.Collections.Generic;

namespace JanKIS.API.Models
{
    public class MedicationPlan
    {
        public string PatientId { get; set; }
        public Drug Drug { get; set; }
        public List<MedicationDispension> Dispensions { get; set; }
    }
}
