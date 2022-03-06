using System;
using HealthModels.Symptoms;
using TypescriptGenerator.Attributes;

namespace HealthModels.Icd.Annotation.Diagnostics
{
    public class Observation : IId
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; }
        [TypescriptIsOptional]
        public BodyStructure BodyStructure { get; set; }
    }
}
