namespace HealthModels.DiagnosticTestResults
{
    public class DocumentDiagnosticTestResult : DiagnosticTestResult
    {
        public override DiagnosticTestScaleType ScaleType => DiagnosticTestScaleType.Document;
        public string DocumentId { get; set; }
    }
}