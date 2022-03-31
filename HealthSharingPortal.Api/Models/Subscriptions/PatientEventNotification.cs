using System;
using HealthModels;
using HealthSharingPortal.API.Storage;

namespace HealthSharingPortal.API.Models.Subscriptions
{
    public class PatientEventNotification : NotificationBase
    {
        public PatientEventNotification(
            string id,
            SubscriptionBase subscription,
            bool isDismissed,
            DateTime timestamp,
            string submitter,
            Person patient,
            HealthRecordEntryType eventType,
            string objectId,
            StorageOperation storageOperation)
            : base(id,
                subscription,
                isDismissed,
                timestamp,
                submitter)
        {
            Patient = patient;
            EventType = eventType;
            ObjectId = objectId;
            StorageOperation = storageOperation;
        }

        public override string NotificationType => Subscriptions.NotificationType.NewPatientEvent.ToString();
        public Person Patient { get; set; }
        public HealthRecordEntryType EventType { get; set; }
        public string ObjectId { get; set; }
        public StorageOperation StorageOperation { get; set; }
    }
}