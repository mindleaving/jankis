using HealthModels.Converters;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace HealthModels.Services
{
    [BsonKnownTypes(
        typeof(TextServiceParameter), 
        typeof(NumberServiceParameter),
        typeof(BooleanServiceParameter),
        typeof(OptionsServiceParameter),
        typeof(PatientServiceParameter))]
    [JsonConverter(typeof(ServiceParameterJsonConverter))]
    public abstract class ServiceParameter
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public abstract ServiceParameterValueType ValueType { get; }
    }
}