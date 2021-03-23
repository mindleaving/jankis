namespace JanKIS.API.Models
{
    public class BloodPressureObservation : Observation
    {
        public int Systolic { get; set; }
        public int Diastolic { get; set; }
    }
}