namespace HealthModels.Services
{
    public class QuantitativeDiagnosticTestDefinition : DiagnosticTestDefinition
    {
        public string Unit { get; set; }
        public double ReferenceRangeStart { get; set; }
        public double ReferenceRangeEnd { get; set; }
    }
}