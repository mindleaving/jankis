namespace HealthModels
{
    public class NominalDiagnosticTestResult : DiagnosticTestResult
    {
        public override DiagnosticTestScaleType ScaleType => DiagnosticTestScaleType.Nominal;
        public string Value { get; set; }
    }
}