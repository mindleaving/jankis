using System.Collections.Generic;
using HealthModels.DiagnosticTestResults;

namespace HealthModels.Icd.Annotation.Diagnostics
{
    public class SetDiagnosticCriteria : DiagnosticCriteria
    {
        public override DiagnosticTestScaleType ScaleType => DiagnosticTestScaleType.Set;
        public List<string> ExpectedResponses { get; } = new();
    }
}