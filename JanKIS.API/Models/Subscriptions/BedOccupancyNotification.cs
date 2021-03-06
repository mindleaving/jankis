using System;

namespace JanKIS.API.Models.Subscriptions
{
    public class BedOccupancyNotification : NotificationBase
    {
        public BedOccupancyNotification(string id,
            SubscriptionBase subscription,
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

        public override NotificationType NotificationType => NotificationType.NewBedOccupancy;
        public BedOccupancy BedOccupancy { get; private set; }
    }
}
