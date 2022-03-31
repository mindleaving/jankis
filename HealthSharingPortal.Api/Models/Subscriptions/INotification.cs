using System;
using HealthModels;

namespace HealthSharingPortal.API.Models.Subscriptions
{
    public interface INotification : IId
    {
        string NotificationType { get; }
        SubscriptionBase Subscription { get; }
        bool IsDismissed { get; }
        /// <summary>
        /// Person who performed the change that triggered this notification
        /// </summary>
        string Submitter { get; }
        DateTime Timestamp { get; }
    }
}
