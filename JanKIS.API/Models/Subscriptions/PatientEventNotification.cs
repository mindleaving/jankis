using System;

namespace JanKIS.API.Models.Subscriptions
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
            PatientEventType eventType,
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

        public override NotificationType NotificationType => NotificationType.NewPatientEvent;
        public Person Patient { get; set; }
        public PatientEventType EventType { get; set; }
        public string ObjectId { get; set; }
        public StorageOperation StorageOperation { get; set; }
    }
}