using System;
using HealthSharingPortal.API.Models.Subscriptions;

namespace JanKIS.API.Models.Subscriptions
{
    public class ServiceRequestNotification : NotificationBase
    {
        public ServiceRequestNotification(string id,
            SubscriptionBase subscription,
            bool isDismissed,
            DateTime timestamp,
            string submitter,
            string requestId)
            : base(id, 
                subscription,
                isDismissed,
                timestamp,
                submitter)
        {
            RequestId = requestId;
        }

        public override string NotificationType => Subscriptions.NotificationType.NewServiceRequest.ToString();
        public string RequestId { get; private set; }
    }
}
