namespace JanKIS.API.Models
{
    public class NominalDiagnosticTestResult : DiagnosticTestResult
    {
        public override DiagnosticTestScaleType ScaleType => DiagnosticTestScaleType.Quantitative;
        public string Value { get; set; }
    }
}