namespace JanKIS.API.Models
{
    public class DiagnosticTestDefinition : ServiceDefinition
    {
        public string TestCodeLoinc { get; set; }
        public string TestCodeLocal { get; set; }
        public string Category { get; set; }
        public DiagnosticTestScaleType ScaleType { get; set; }
    }
    public class QuantitativeDiagnosticTestDefinition : DiagnosticTestDefinition
    {
        public string Unit { get; set; }
        public double ReferenceRangeStart { get; set; }
        public double ReferenceRangeEnd { get; set; }
    }
}