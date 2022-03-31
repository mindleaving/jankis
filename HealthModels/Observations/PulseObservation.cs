using TypescriptGenerator.Attributes;

namespace HealthModels.Observations
{
    public class PulseObservation : Observation
    {
        public override string MeasurementType { get; set; } = Observations.MeasurementType.Pulse.ToString();
        public int BPM { get; set; }
        [TypescriptIsOptional]
        public string Location { get; set; }
    }
}