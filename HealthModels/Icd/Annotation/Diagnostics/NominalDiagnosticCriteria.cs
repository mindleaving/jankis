using System.Collections.Generic;
using HealthModels.DiagnosticTestResults;

namespace HealthModels.Icd.Annotation.Diagnostics
{
    public class NominalDiagnosticCriteria : DiagnosticCriteria
    {
        public override DiagnosticTestScaleType ScaleType => DiagnosticTestScaleType.Nominal;
        public List<string> ExpectedResponses { get; } = new();
    }
}