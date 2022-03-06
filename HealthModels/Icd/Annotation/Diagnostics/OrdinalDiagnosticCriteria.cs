using System.Collections.Generic;
using HealthModels.DiagnosticTestResults;

namespace HealthModels.Icd.Annotation.Diagnostics
{
    public class OrdinalDiagnosticCriteria : DiagnosticCriteria
    {
        public override DiagnosticTestScaleType ScaleType => DiagnosticTestScaleType.Ordinal;
        public List<string> ExpectedResponses { get; } = new();
    }
}