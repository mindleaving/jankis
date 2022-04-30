namespace HealthModels.Medication
{
    public enum MedicationDispensionState
    {
        Undefined = 0, // For validation
        Scheduled = 1,
        Dispensed = 2,
        Missed = 3,
        Skipped = 4
    }
}