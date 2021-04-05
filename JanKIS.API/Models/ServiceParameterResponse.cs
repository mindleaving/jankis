using MongoDB.Bson.Serialization.Attributes;

namespace JanKIS.API.Models
{
    [BsonKnownTypes(
        typeof(TextServiceParameterResponse), 
        typeof(NumberServiceParameterResponse),
        typeof(OptionsServiceParameterResponse),
        typeof(BooleanServiceParameterResponse),
        typeof(PatientServiceParameterResponse))]
    public abstract class ServiceParameterResponse
    {
        public string ParameterName { get; set; }
        public abstract ServiceParameterValueType ValueType { get; }
    }
}