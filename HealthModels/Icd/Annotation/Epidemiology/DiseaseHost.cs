using System;

namespace HealthModels.Icd.Annotation.Epidemiology
{
    public class DiseaseHost : IId
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; }
    }
}