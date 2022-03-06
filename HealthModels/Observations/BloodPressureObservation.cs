namespace HealthModels.Observations
{
    public class BloodPressureObservation : Observation
    {
        public override string MeasurementType { get; set; } =  Observations.MeasurementType.BloodPressure.ToString();
        public int Systolic { get; set; }
        public int Diastolic { get; set; }
    }
}