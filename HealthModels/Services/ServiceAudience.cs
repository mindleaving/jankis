using HealthModels.Converters;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace HealthModels.Services
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