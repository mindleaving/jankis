using System;
using HealthModels;

namespace HealthSharingPortal.API.Models.Subscriptions
{
    public class MedicationScheduleNotification : NotificationBase
    {
        public MedicationScheduleNotification(
            string id,
            SubscriptionBase subscription,
            bool isDismissed,
            DateTime timestamp,
            string submitter,
            Person patient,
            string scheduleId,
            StorageOperation storageOperation)
            : base(id,
                subscription,
                isDismissed,
                timestamp,
                submitter)
        {
            Patient = patient;
            ScheduleId = scheduleId;
            StorageOperation = storageOperation;
        }

        public override string NotificationType => Subscriptions.NotificationType.MedicationScheduleChange.ToString();
        public Person Patient { get; set; }
        public string ScheduleId { get; }
        public StorageOperation StorageOperation { get; set; }
    }
}