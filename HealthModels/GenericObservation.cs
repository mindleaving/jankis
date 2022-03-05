namespace HealthModels
{
    public class GenericObservation : Observation
    {
        public GenericObservation(string measurementType)
        {
            MeasurementType = measurementType;
        }

        public override string MeasurementType { get; set; }
        public string Value { get; set; }
        public string Unit { get; set; }
    }
}