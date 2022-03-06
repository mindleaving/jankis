using Commons.Physics;
using HealthModels.DiagnosticTestResults;
using TypescriptGenerator.Attributes;

namespace HealthModels.Icd.Annotation.Diagnostics
{
    public class QuantativeDiagnosticCriteria : DiagnosticCriteria
    {
        public override DiagnosticTestScaleType ScaleType => DiagnosticTestScaleType.Quantitative;
        [TypescriptIsOptional]
        public UnitValue RangeStart { get; set; }
        [TypescriptIsOptional]
        public UnitValue RangeEnd { get; set; }
    }
}