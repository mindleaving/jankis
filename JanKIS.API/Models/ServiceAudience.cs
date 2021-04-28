using JanKIS.API.Converters;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace JanKIS.API.Models
{
    [BsonKnownTypes(
        typeof(AllServiceAudience),
        typeof(RoleServiceAudience),
        typeof(PersonServiceAudience))]
    [JsonConverter(typeof(ServiceAudienceJsonConverter))]
    public abstract class ServiceAudience
    {
        public abstract ServiceAudienceType Type { get; }
    }
}