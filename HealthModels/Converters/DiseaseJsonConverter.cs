using System;
using HealthModels.Icd.Annotation;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace HealthModels.Converters
{
    public class DiseaseJsonConverter : JsonConverter<Disease>
    {
        public override bool CanWrite => false;

        public override Disease ReadJson(
            JsonReader reader,
            Type objectType,
            Disease existingValue,
            bool hasExistingValue,
            JsonSerializer serializer)
        {
            var jObject = JObject.Load(reader);
            Disease item;
            if (jObject.ContainsKey(nameof(InfectiousDisease.Pathogens)) || jObject.ContainsKey(nameof(InfectiousDisease.Pathogens).ToLower()))
            {
                item = new InfectiousDisease();
            }
            else
            {
                item = new Disease();
            }

            serializer.Populate(jObject.CreateReader(), item);
            
            return item;
        }

        public override void WriteJson(
            JsonWriter writer,
            Disease value,
            JsonSerializer serializer)
        {
            throw new NotSupportedException();
        }
    }
}
