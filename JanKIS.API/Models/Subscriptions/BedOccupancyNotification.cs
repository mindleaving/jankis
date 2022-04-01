using System;

namespace JanKIS.API.Models.Subscriptions
{
    public class BedOccupancyNotification : HealthSharingPortal.API.Models.Subscriptions.NotificationBase
    {
        public BedOccupancyNotification(string id,
            HealthSharingPortal.API.Models.Subscriptions.SubscriptionBase subscription,
            bool isDismissed,
            DateTime timestamp,
            string submitter,
            BedOccupancy bedOccupancy)
            : base(
                id, 
                subscription,
                isDismissed,
                timestamp,
                submitter)
        {
            BedOccupancy = bedOccupancy;
        }

        public override string NotificationType => Subscriptions.NotificationType.NewBedOccupancy.ToString();
        public BedOccupancy BedOccupancy { get; private set; }
    }
}
