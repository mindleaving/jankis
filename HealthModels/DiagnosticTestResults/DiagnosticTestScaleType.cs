namespace HealthModels.DiagnosticTestResults
{
    public enum DiagnosticTestScaleType
    {
        Undefined = 0, // For validation. Do not use as valid value.

        Quantitative = 1,
        Ordinal = 2,
        OrdinalOrQuantitative = 3,
        Nominal = 4,
        Freetext = 5,
        Document = 6,
        Set = 7
    }
}