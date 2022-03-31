using TypescriptGenerator.Attributes;

namespace HealthModels.DiagnosticTestResults
{
    public class QuantitativeDiagnosticTestResult : DiagnosticTestResult
    {
        public override DiagnosticTestScaleType ScaleType => DiagnosticTestScaleType.Quantitative;
        public double Value { get; set; }
        [TypescriptIsOptional]
        public string Unit { get; set; }
        [TypescriptIsOptional]
        public double ReferenceRangeStart { get; set; }
        [TypescriptIsOptional]
        public double ReferenceRangeEnd { get; set; }
    }
}