using System.Collections.Generic;
using HealthModels.Icd.Annotation.Epidemiology;

namespace HealthModels.Icd.Annotation
{
    public class InfectiousDisease : Disease
    {
        public List<Microb> Pathogens { get; set; } = new List<Microb>();
        public List<DiseaseHost> Hosts { get; set; } = new List<DiseaseHost>();
    }
}