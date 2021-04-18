using JanKIS.API.Converters;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace JanKIS.API.Models
{
    [BsonKnownTypes(
        typeof(TextServiceParameterResponse), 
        typeof(NumberServiceParameterResponse),
        typeof(OptionsServiceParameterResponse),
        typeof(BooleanServiceParameterResponse),
        typeof(PatientServiceParameterResponse))]
    [JsonConverter(typeof(ServiceParameterResponseJsonConverter))]
    public abstract class ServiceParameterResponse
    {
        public string ParameterName { get; set; }
        public abstract ServiceParameterValueType ValueType { get; }
    }
}