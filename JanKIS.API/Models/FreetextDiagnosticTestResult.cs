namespace JanKIS.API.Models
{
    public class FreetextDiagnosticTestResult : DiagnosticTestResult
    {
        public override DiagnosticTestScaleType ScaleType => DiagnosticTestScaleType.Quantitative;
        public string Text { get; set; }
    }
}