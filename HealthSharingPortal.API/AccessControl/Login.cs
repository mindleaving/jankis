using HealthModels;
using MongoDB.Bson.Serialization.Attributes;

namespace HealthSharingPortal.API.AccessControl
{
    [BsonKnownTypes(typeof(LocalLogin), typeof(ExternalLogin))]
    public abstract class Login : IId
    {
        public string Id { get; set; }
        public abstract LoginType Type { get; }
    }
}
