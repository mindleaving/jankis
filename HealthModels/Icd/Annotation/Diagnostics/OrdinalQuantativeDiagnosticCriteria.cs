using System.Collections.Generic;
using Commons.Physics;
using HealthModels.DiagnosticTestResults;
using TypescriptGenerator.Attributes;

namespace HealthModels.Icd.Annotation.Diagnostics
{
    public class OrdinalQuantativeDiagnosticCriteria : DiagnosticCriteria
    {
        public override DiagnosticTestScaleType ScaleType => DiagnosticTestScaleType.Ordinal;
        public List<string> ExpectedResponses { get; } = new();
        [TypescriptIsOptional]
        public UnitValue RangeStart { get; set; }
        [TypescriptIsOptional]
        public UnitValue RangeEnd { get; set; }
    }
}