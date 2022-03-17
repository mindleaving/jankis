using System;
using HealthModels.Services;

namespace JanKIS.API.Models.Subscriptions
{
    public class ServiceNotification : NotificationBase
    {
        public ServiceNotification(string id,
            SubscriptionBase subscription,
            bool isDismissed,
            DateTime timestamp,
            string submitter,
            ServiceDefinition service)
            : base(id, 
                subscription,
                isDismissed,
                timestamp,
                submitter)
        {
            Service = service;
        }

        public override NotificationType NotificationType => NotificationType.NewService;
        public ServiceDefinition Service { get; private set; }
    }
}
