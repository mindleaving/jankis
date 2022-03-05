namespace HealthModels
{
    public class PulseObservation : Observation
    {
        public override string MeasurementType { get; set; } = HealthModels.MeasurementType.Pulse.ToString();
        public int BPM { get; set; }
        public string Location { get; set; }
    }
}