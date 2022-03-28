using HealthModels.DiagnosticTestResults;

namespace HealthModels.Services
{
    public class DiagnosticTestDefinition : ServiceDefinition
    {
        public string TestCodeLoinc { get; set; }
        public string TestCodeLocal { get; set; }
        public string Category { get; set; }
        public DiagnosticTestScaleType ScaleType { get; set; }
    }
}