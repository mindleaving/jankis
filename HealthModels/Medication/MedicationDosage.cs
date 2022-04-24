namespace HealthModels.Medication
{
    public class MedicationDosage
    {
        public MedicationDosage(
            double value,
            string unit)
        {
            Value = value;
            Unit = unit;
        }

        public double Value { get; set; }
        public string Unit { get; set; }
    }
}