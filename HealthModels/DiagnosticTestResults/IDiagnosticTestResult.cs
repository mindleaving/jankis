using TypescriptGenerator.Attributes;

namespace HealthModels.DiagnosticTestResults
{
    public interface IDiagnosticTestResult : IHealthRecordEntry
    {
        string TestCodeLoinc { get; set; }
        [TypescriptIsOptional]
        string TestCodeLocal { get; set; }
        string TestName { get; set; }
        DiagnosticTestScaleType ScaleType { get; }
    }
}