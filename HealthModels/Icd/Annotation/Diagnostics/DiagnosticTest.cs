using HealthModels.DiagnosticTestResults;

namespace HealthModels.Icd.Annotation.Diagnostics
{
    public class DiagnosticTest : IDiagnosticTest
    {
        public string Id => LoincCode;
        public string LoincCode { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DiagnosticTestScaleType ScaleType { get; set; }
        public string BodyStructure { get; set; }
        public string MethodType { get; set; }
        public string Category { get; set; }
        public string TimeAspect { get; set; }
        public string MeasuredProperty { get; set; }
        public string Formula { get; set; }
    }
}