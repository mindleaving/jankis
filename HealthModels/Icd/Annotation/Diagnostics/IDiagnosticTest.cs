using HealthModels.DiagnosticTestResults;

namespace HealthModels.Icd.Annotation.Diagnostics
{
    public interface IDiagnosticTest : IId
    {
        public string LoincCode { get; }
        public string Name { get; }
        public DiagnosticTestScaleType ScaleType { get; }
    }
}