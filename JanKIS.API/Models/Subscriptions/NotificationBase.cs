using System;
using JanKIS.API.Converters;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace JanKIS.API.Models.Subscriptions
{
    [BsonKnownTypes(
        typeof(PatientEventNotification)
    )]
    [JsonConverter(typeof(NotificationJsonConverter))]
    public abstract class NotificationBase : INotification
    {
        protected NotificationBase(
            string id,
            SubscriptionBase subscription,
            bool isDismissed,
            DateTime timestamp,
            string submitter)
        {
            Id = id;
            Subscription = subscription;
            IsDismissed = isDismissed;
            Timestamp = timestamp;
            Submitter = submitter;
        }

        public string Id { get; private set; }
        public abstract NotificationType NotificationType { get; }
        public SubscriptionBase Subscription { get; private set; }
        public bool IsDismissed { get; private set; }
        public string Submitter { get; private set; }
        public DateTime Timestamp { get; private set; }
    }
}