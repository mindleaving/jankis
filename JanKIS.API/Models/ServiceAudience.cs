using MongoDB.Bson.Serialization.Attributes;

namespace JanKIS.API.Models
{
    [BsonKnownTypes(
        typeof(AllServiceAudience),
        typeof(RoleServiceAudience),
        typeof(PersonServiceAudience))]
    public abstract class ServiceAudience
    {
        public ServiceAudienceType Type { get; set; }
    }
}