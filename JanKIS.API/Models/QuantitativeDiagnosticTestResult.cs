namespace JanKIS.API.Models
{
    public class QuantitativeDiagnosticTestResult : DiagnosticTestResult
    {
        public override DiagnosticTestScaleType ScaleType => DiagnosticTestScaleType.Quantitative;
        public string Unit { get; set; }
        public double ReferenceRangeStart { get; set; }
        public double ReferenceRangeEnd { get; set; }
    }
}