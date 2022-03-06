using HealthModels.DiagnosticTestResults;

namespace HealthModels.Icd.Annotation.Diagnostics
{
    public class DocumentDiagnosticCriteria : DiagnosticCriteria
    {
        public override DiagnosticTestScaleType ScaleType => DiagnosticTestScaleType.Document;
    }
}