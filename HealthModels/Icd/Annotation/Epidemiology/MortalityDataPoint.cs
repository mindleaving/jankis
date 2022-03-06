using System;
using Commons.Mathematics;
using TypescriptGenerator.Attributes;

namespace HealthModels.Icd.Annotation.Epidemiology
{
    public class MortalityDataPoint : IId
    {
        public MortalityDataPoint(double mortality,
            double yearsAfterDiagnosis,
            Sex? sex = null,
            Range<double> ageRange = null)
        {
            Mortality = mortality;
            YearsAfterDiagnosis = yearsAfterDiagnosis;
            Sex = sex;
            AgeRange = ageRange;
        }

        public string Id { get; private set; } = Guid.NewGuid().ToString();
        public double Mortality { get; set; }
        public double YearsAfterDiagnosis { get; set; }
        public Sex? Sex { get; set; }
        [TypescriptIsOptional]
        public Range<double> AgeRange { get; set; }
    }
}