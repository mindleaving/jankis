using System.Collections.Generic;
using TypescriptGenerator.Attributes;

namespace HealthModels.Medication
{
    public class MedicationScheduleItem : IId
    {
        public string Id { get; set; }
        public Drug Drug { get; set; }
        public List<MedicationDispension> PlannedDispensions { get; set; }
        [TypescriptIsOptional]
        public MedicationSchedulePattern Pattern { get; set; }
        [TypescriptIsOptional]
        public MedicationAdministrationInstructions Instructions { get; set; }
        public string Note { get; set; }
        public bool IsPaused { get; set; }
        public bool IsDispendedByPatient { get; set; }
    }

    public class MedicationAdministrationInstructions
    {
        public bool InConjunctionWithMeal { get; set; }
    }

    public class MedicationSchedulePattern
    {
        public MedicationSchedulePatternType PatternType { get; set; }
        [TypescriptIsOptional]
        public string Unit { get; set; }

        public int Morning { get; set; }
        public int Noon { get; set; }
        public int Evening { get; set; }
        public int Night { get; set; }
    }

    public enum MedicationSchedulePatternType
    {
        PillCount,
        Amount
    }
}
