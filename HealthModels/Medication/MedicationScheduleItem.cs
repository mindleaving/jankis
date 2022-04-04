using System.Collections.Generic;

namespace HealthModels.Medication
{
    public class MedicationScheduleItem : IId
    {
        public string Id { get; set; }
        public Drug Drug { get; set; }
        public List<MedicationDispension> Dispensions { get; set; }
        // TODO: Add MedicationDispensionPattern that models future dispensions and can be used to generate dispensions.
        // Properties: PatternString (e.g. 1-0-1-1), how to model daily, weekly, monthly and unregular dispensions? How on-demand?
        public string Note { get; set; }
        public bool IsPaused { get; set; }
        public bool IsDispendedByPatient { get; set; }
    }
}
