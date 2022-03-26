namespace HealthModels
{
    public enum HealthRecordEntryType
    {
        Undefined = 0, // For validation
        Observation = 1,
        Note = 2,
        TestResult = 3,
        Document = 4,
        MedicationDispension = 5,
        Equipment = 6,
        Diagnosis = 7
    }
}