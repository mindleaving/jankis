using System;
using Commons.Mathematics;
using TypescriptGenerator.Attributes;

namespace HealthModels.Icd.Annotation.Epidemiology
{
    public class PrevalenceDataPoint : IId
    {
        public PrevalenceDataPoint(
            double prevalence,
            Location location = null,
            Sex? sex = null,
            Range<double> ageRange = null)
        {
            Prevalence = prevalence;
            Location = location;
            Sex = sex;
            AgeRange = ageRange;
        }
        
        public string Id { get; private set; } = Guid.NewGuid().ToString();
        public double Prevalence { get; set; }
        public Location Location { get; set; }
        public Sex? Sex { get; set; }
        [TypescriptIsOptional]
        public Range<double> AgeRange { get; set; }
    }
}