using System;
using HealthModels;

namespace JanKIS.API.Models.Subscriptions
{
    public class AdmissionNotification : NotificationBase
    {
        public AdmissionNotification(
            string id,
            SubscriptionBase subscription,
            bool isDismissed,
            DateTime timestamp,
            string submitter,
            Admission admission)
            : base(
                id, 
                subscription,
                isDismissed,
                timestamp,
                submitter)
        {
            Admission = admission;
        }

        public override NotificationType NotificationType => NotificationType.NewAdmission;
        public Admission Admission { get; set; }
    }
}
