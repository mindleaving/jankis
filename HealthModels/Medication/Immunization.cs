using TypescriptGenerator.Attributes;

namespace HealthModels.Medication
{
    public class Immunization : MedicationDispension
    {
        public override HealthRecordEntryType Type => HealthRecordEntryType.Immunization;
        [TypescriptIsOptional]
        public string BatchNumber { get; set; }
    }
}
