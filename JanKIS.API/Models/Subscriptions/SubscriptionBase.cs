using HealthSharingPortal.API.Models.Subscriptions;
using JanKIS.API.Converters;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace JanKIS.API.Models.Subscriptions
{
    [BsonKnownTypes(
        typeof(ServiceSubscription),
        typeof(ServiceRequestSubscription),
        typeof(PatientSubscription)
    )]
    [JsonConverter(typeof(SubscriptionJsonConverter))]
    public abstract class SubscriptionBase : HealthSharingPortal.API.Models.Subscriptions.SubscriptionBase
    {
        protected SubscriptionBase(): base() {}
        protected SubscriptionBase(
            string id, 
            string username)
        : base(id, username)
        {
        }
    }
}