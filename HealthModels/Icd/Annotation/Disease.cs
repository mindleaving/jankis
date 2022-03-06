using System.Collections.Generic;
using HealthModels.Converters;
using HealthModels.Icd.Annotation.Diagnostics;
using HealthModels.Icd.Annotation.Epidemiology;
using HealthModels.Observations;
using HealthModels.Symptoms;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace HealthModels.Icd.Annotation
{
    [JsonConverter(typeof(DiseaseJsonConverter))]
    [BsonKnownTypes(typeof(InfectiousDisease))]
    public class Disease : IId
    {
        [JsonIgnore]
        public string Id => IcdCode;
        public string IcdCode { get; set; }
        public string Name { get; set; }

        /// <summary>
        /// ICD-Code of parent category
        /// </summary>
        public string CategoryIcdCode { get; set; }
        
        public List<BodyStructure> AffectedBodyStructures { get; set; } = new List<BodyStructure>();
        public List<Symptom> Symptoms { get; set; } = new List<Symptom>();
        public List<Observation> Observations { get; set; } = new List<Observation>();
        public List<DiagnosticCriteria> DiagnosticCriteria { get; set; } = new List<DiagnosticCriteria>();
        public DiseaseEpidemiology Epidemiology { get; set; } = new DiseaseEpidemiology();
        public List<RiskFactor> RiskFactors { get; set; } = new List<RiskFactor>();
        public List<string> References { get; set; } = new List<string>();
    }
}