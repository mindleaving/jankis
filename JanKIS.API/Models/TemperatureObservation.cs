namespace JanKIS.API.Models
{
    public class TemperatureObservation : Observation
    {
        public override string MeasurementType => Models.MeasurementType.Temperature.ToString();
        public double Value { get; set; }
        public string Unit { get; set; }
        public string BodyPart { get; set; }
    }
}
