using System;
using HealthModels;
using JanKIS.API.Storage;

namespace JanKIS.API.Models.Subscriptions
{
    public interface INotification : IId
    {
        NotificationType NotificationType { get; }
        SubscriptionBase Subscription { get; }
        bool IsDismissed { get; }
        /// <summary>
        /// Person who performed the change that triggered this notification
        /// </summary>
        string Submitter { get; }
        DateTime Timestamp { get; }
    }
}
