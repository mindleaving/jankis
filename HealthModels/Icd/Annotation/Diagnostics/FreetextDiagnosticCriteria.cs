using HealthModels.DiagnosticTestResults;

namespace HealthModels.Icd.Annotation.Diagnostics
{
    public class FreetextDiagnosticCriteria : DiagnosticCriteria
    {
        public override DiagnosticTestScaleType ScaleType => DiagnosticTestScaleType.Freetext;
    }
}