using System;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using NotificationJsonConverter = JanKIS.API.Converters.NotificationJsonConverter;

namespace JanKIS.API.Models.Subscriptions
{
    [BsonKnownTypes(
        typeof(PatientEventNotification)
    )]
    [JsonConverter(typeof(NotificationJsonConverter))]
    public abstract class NotificationBase : HealthSharingPortal.API.Models.Subscriptions.NotificationBase
    {
        protected NotificationBase(
            string id,
            HealthSharingPortal.API.Models.Subscriptions.SubscriptionBase subscription,
            bool isDismissed,
            DateTime timestamp,
            string submitter)
            : base(
                id, 
                subscription, 
                isDismissed,
                timestamp,
                submitter)
        {
        }
    }
}