namespace HealthModels
{
    public class FreetextDiagnosticTestResult : DiagnosticTestResult
    {
        public override DiagnosticTestScaleType ScaleType => DiagnosticTestScaleType.Freetext;
        public string Text { get; set; }
    }
}