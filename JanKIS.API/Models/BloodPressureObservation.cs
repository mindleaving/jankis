namespace JanKIS.API.Models
{
    public class BloodPressureObservation : Observation
    {
        public override string MeasurementType => Models.MeasurementType.BloodPressure.ToString();
        public int Systolic { get; set; }
        public int Diastolic { get; set; }
    }
}