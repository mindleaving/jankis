using System;

namespace HealthSharingPortal.API.Models.Subscriptions
{
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
        public abstract string NotificationType { get; }
        public SubscriptionBase Subscription { get; private set; }
        public bool IsDismissed { get; private set; }
        public string Submitter { get; private set; }
        public DateTime Timestamp { get; private set; }
    }
}