using System;
using HealthModels.Converters;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace HealthModels.Icd.Annotation.Symptoms
{
    [BsonKnownTypes(typeof(SystemicSymptom), typeof(LocalizedSymptom))]
    [JsonConverter(typeof(SymptomJsonConverter))]
    public abstract class Symptom : IId
    {
        protected Symptom(SymptomType type)
        {
            Type = type;
        }
        protected Symptom(SymptomType type,
            string name) : this(type)
        {
            Name = name;
        }

        public string Id { get; set; } = Guid.NewGuid().ToString();
        public SymptomType Type { get; }
        public string Name { get; set; }
    }
}
