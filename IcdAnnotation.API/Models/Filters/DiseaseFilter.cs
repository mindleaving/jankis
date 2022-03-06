using TypescriptGenerator.Attributes;

namespace IcdAnnotation.API.Models.Filters
{
    public class DiseaseFilter
    {
        [TypescriptIsOptional]
        public string SearchText { get; set; }

        public bool? HasIncidenceData { get; set; }
        public bool? HasPrevalenceData { get; set; }
        public bool? HasMortalityData { get; set; }
        public bool? HasSymptoms { get; set; }
        public bool? HasObservations { get; set; }
        public bool? HasDiagnosticCriteria { get; set; }
        public bool? HasAffectedBodyStructures { get; set; }
        public bool? IsInfectiousDisease { get; set; }
        public bool? HasDiseaseHosts { get; set; }
        public bool? HasPathogens { get; set; }
    }
}
