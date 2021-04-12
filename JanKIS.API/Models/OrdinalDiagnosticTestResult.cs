namespace JanKIS.API.Models
{
    public class OrdinalDiagnosticTestResult : DiagnosticTestResult
    {
        public override DiagnosticTestScaleType ScaleType => DiagnosticTestScaleType.Quantitative;
        public string Value { get; set; }
        public int NumericalValue { get; set; }
    }
}