namespace JanKIS.API.Models
{
    public class DocumentDiagnosticTestResult : DiagnosticTestResult
    {
        public override DiagnosticTestScaleType ScaleType => DiagnosticTestScaleType.Document;
        public string DocumentId { get; set; }
    }
}