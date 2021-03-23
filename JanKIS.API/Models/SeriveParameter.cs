using MongoDB.Bson.Serialization.Attributes;

namespace JanKIS.API.Models
{
    [BsonKnownTypes(typeof(TextServiceParameter))]
    public abstract class SeriveParameter
    {
        public string Name { get; set; }
        public ServiceParameterValueType ValueType { get; set; }
    }
}