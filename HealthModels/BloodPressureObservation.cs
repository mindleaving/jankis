namespace HealthModels
{
    public class BloodPressureObservation : Observation
    {
        public override string MeasurementType { get; set; } =  HealthModels.MeasurementType.BloodPressure.ToString();
        public int Systolic { get; set; }
        public int Diastolic { get; set; }
    }
}