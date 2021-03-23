namespace JanKIS.API.Models
{
    public class PulseObservation : Observation
    {
        public int BPM { get; set; }
        public string Location { get; set; }
    }
}