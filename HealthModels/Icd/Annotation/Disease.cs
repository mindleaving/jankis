using System.Collections.Generic;
using HealthModels.Converters;
using HealthModels.Icd.Annotation.Diagnostics;
using HealthModels.Icd.Annotation.Epidemiology;
using HealthModels.Icd.Annotation.Symptoms;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using TypescriptGenerator.Attributes;

namespace HealthModels.Icd.Annotation
{
    [JsonConverter(typeof(DiseaseJsonConverter))]
    [BsonKnownTypes(typeof(InfectiousDisease))]
    public class Disease : IId
    {
        [JsonIgnore]
        public string Id => Icd11Code;
        public string Icd11Code { get; set; }
        [TypescriptIsOptional]
        public string Icd10Code { get; set; }
        public string Name { get; set; }
        [TypescriptIsOptional]
        public DiseaseLock EditLock { get; set; }

        /// <summary>
        /// ICD-Code of parent category
        /// </summary>
        public string CategoryIcdCode { get; set; }
        
        public List<BodyStructure> AffectedBodyStructures { get; set; } = new();
        public List<Symptom> Symptoms { get; set; } = new();
        public List<Diagnostics.Observation> Observations { get; set; } = new();
        public List<DiagnosticCriteria> DiagnosticCriteria { get; set; } = new();
        public DiseaseEpidemiology Epidemiology { get; set; } = new();
        public List<RiskFactor> RiskFactors { get; set; } = new();
        public List<string> References { get; set; } = new();
    }
}