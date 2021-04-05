namespace JanKIS.API.Models
{
    public class OrdinalOrQuantitativeDiagnosticTestResult : DiagnosticTestResult
    {
        public override DiagnosticTestScaleType ScaleType => DiagnosticTestScaleType.Quantitative;
    }
}