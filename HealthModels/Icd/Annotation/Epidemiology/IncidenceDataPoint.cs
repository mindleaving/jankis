using System;
using System.Collections.Generic;
using Commons.Mathematics;
using TypescriptGenerator.Attributes;

namespace HealthModels.Icd.Annotation.Epidemiology
{
    public class IncidenceDataPoint : IId
    {
        public IncidenceDataPoint(double incidence,
            Location location = null,
            List<TimeOfYear> timeOfYear = null,
            Sex? sex = null,
            Range<double> ageRange = null,
            string preexistingCondition = null)
        {
            Incidence = incidence;
            Location = location;
            TimeOfYear = timeOfYear;
            Sex = sex;
            AgeRange = ageRange;
            PreexistingCondition = preexistingCondition;
        }

        public string Id { get; private set; } = Guid.NewGuid().ToString();
        public double Incidence { get; set; }
        public Location Location { get; set; }
        [TypescriptIsOptional]
        public List<TimeOfYear> TimeOfYear { get; set; }
        public Sex? Sex { get; set; }
        [TypescriptIsOptional]
        public Range<double> AgeRange { get; set; }
        [TypescriptIsOptional]
        public string PreexistingCondition { get; set; }
    }
}