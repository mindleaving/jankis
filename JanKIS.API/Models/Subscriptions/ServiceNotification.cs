using System;
using HealthModels.Services;
using HealthSharingPortal.API.Models.Subscriptions;

namespace JanKIS.API.Models.Subscriptions
{
    public class ServiceNotification : HealthSharingPortal.API.Models.Subscriptions.NotificationBase
    {
        public ServiceNotification(string id,
            HealthSharingPortal.API.Models.Subscriptions.SubscriptionBase subscription,
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

        public override string NotificationType => Subscriptions.NotificationType.NewService.ToString();
        public ServiceDefinition Service { get; private set; }
    }
}
