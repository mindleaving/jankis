namespace JanKIS.API.Models
{
    public class PulseObservation : Observation
    {
        public override string MeasurementType => Models.MeasurementType.Pulse.ToString();
        public int BPM { get; set; }
        public string Location { get; set; }
    }
}