using TypescriptGenerator.Attributes;

namespace HealthModels.Observations
{
    public class GenericObservation : Observation
    {
        public GenericObservation(string measurementType)
        {
            MeasurementType = measurementType;
        }

        public override string MeasurementType { get; set; }
        public string Value { get; set; }
        [TypescriptIsOptional]
        public string Unit { get; set; }
    }
}