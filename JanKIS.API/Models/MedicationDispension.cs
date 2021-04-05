using System;
using JanKIS.API.Attributes;

namespace JanKIS.API.Models
{
    public class MedicationDispension
    {
        public DateTime Time { get; set; }
        [OfferAutocomplete(Context = "MedicationUnit")]
        public string Unit { get; set; }
        public double Value { get; set; }
        public MedicationDispensionState State { get; set; }
        public string Note { get; set; }
    }
}