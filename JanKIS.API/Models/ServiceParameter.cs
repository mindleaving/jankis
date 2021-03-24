using MongoDB.Bson.Serialization.Attributes;

namespace JanKIS.API.Models
{
    [BsonKnownTypes(typeof(TextServiceParameter), typeof(NumberServiceParameter))]
    public abstract class ServiceParameter
    {
        public string Name { get; set; }
        public ServiceParameterValueType ValueType { get; set; }
    }
}