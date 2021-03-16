using System;

namespace JanKIS.API.Models
{
    public class MedicationDispension
    {
        public DateTime Time { get; set; }
        public MedicationDispensionState State { get; set; }
    }
}