using MongoDB.Bson.Serialization.Attributes;

namespace JanKIS.API.Models
{
    [BsonKnownTypes(typeof(TextServiceParameterResponse), typeof(NumberServiceParameterResponse))]
    public abstract class ServiceParameterResponse
    {
        public ServiceParameterValueType ValueType { get; set; }
    }
}