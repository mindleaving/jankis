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

        public override string NotificationType => Subscriptions.NotificationType.NewAdmission.ToString();
        public Admission Admission { get; set; }
    }
}
