namespace JanKIS.API.Models
{
    public interface IDiagnosticTestResult : IPatientEvent
    {
        string TestCodeLoinc { get; set; }
        string TestCodeLocal { get; set; }
        string TestName { get; set; }
        DiagnosticTestScaleType ScaleType { get; }
    }
}