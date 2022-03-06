using HealthModels.DiagnosticTestResults;

namespace HealthModels.Icd.Annotation.Diagnostics
{
    public interface IDiagnosticCriteria
    {
        public string DiagnosticTestLoincCode { get; }
        public string DiagnosticTestName { get; }
        public DiagnosticTestScaleType ScaleType { get; }

        // Derivations should implement informations matching the test type, e.g. value ranges or list of expected outcomes
    }
}
