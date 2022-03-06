using System;
using System.IO;
using HealthModels.Symptoms;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace HealthModels.Converters
{
    public class SymptomJsonConverter : JsonConverter<Symptom>
    {
        public override bool CanWrite => false;

        public override Symptom ReadJson(
            JsonReader reader,
            Type objectType,
            Symptom existingValue,
            bool hasExistingValue,
            JsonSerializer serializer)
        {
            var jObject = JObject.Load(reader);

            SymptomType type;
            if (jObject.ContainsKey(nameof(Symptom.Type)))
                type = Enum.Parse<SymptomType>(jObject.Value<string>(nameof(Symptom.Type)), true);
            else if (jObject.ContainsKey(nameof(Symptom.Type).ToLower()))
                type = Enum.Parse<SymptomType>(jObject.Value<string>(nameof(Symptom.Type).ToLower()), true);
            else
                throw new InvalidDataException("JSON-object doesn't contain symptom type field");
            Symptom item;
            switch (type)
            {
                case SymptomType.Undefined:
                    throw new InvalidDataException("Symptom type must not be 'Undefined'");
                case SymptomType.Localized:
                    item = new LocalizedSymptom();
                    break;
                case SymptomType.Systemic:
                    item = new SystemicSymptom();
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
            serializer.Populate(jObject.CreateReader(), item);
            
            return item;
        }

        public override void WriteJson(
            JsonWriter writer,
            Symptom value,
            JsonSerializer serializer)
        {
            throw new NotSupportedException();
        }
    }
}
