using System;
using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.API.Hubs;
using HealthSharingPortal.API.Models.Subscriptions;
using HealthSharingPortal.API.Storage;
using Microsoft.AspNetCore.SignalR;

namespace HealthSharingPortal.API.Workflow
{
    public interface INotificationDistributor
    {
        Task NotifyNewPatientEvent(IHealthRecordEntry healthRecordEntry, StorageOperation storageOperation, string submitterUsername);
        Task NotifyNewAdmission(Admission admission, StorageOperation storageOperation, string submitterUsername);
    }

    public class NotificationDistributor : INotificationDistributor
    {
        private readonly INotificationsStore notificationsStore;
        private readonly ISubscriptionsStore subscriptionsStore;
        protected readonly IHubContext<NotificationsHub, INotificationsClient> notificationsHub;
        protected readonly IReadonlyStore<Person> personsStore;

        public NotificationDistributor(
            INotificationsStore notificationsStore,
            ISubscriptionsStore subscriptionsStore,
            IHubContext<NotificationsHub, INotificationsClient> notificationsHub,
            IReadonlyStore<Person> personsStore)
        {
            this.notificationsStore = notificationsStore;
            this.subscriptionsStore = subscriptionsStore;
            this.notificationsHub = notificationsHub;
            this.personsStore = personsStore;
        }

        public async Task NotifyNewPatientEvent(
            IHealthRecordEntry healthRecordEntry,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            var now = DateTime.UtcNow;
            var patient = await personsStore.GetByIdAsync(healthRecordEntry.PersonId);
            var matchingSubscriptions = await subscriptionsStore.GetPatientSubscriptions(healthRecordEntry.PersonId);
            foreach (var subscription in matchingSubscriptions)
            {
                var notification = new PatientEventNotification(
                    Guid.NewGuid().ToString(),
                    subscription,
                    false,
                    now,
                    submitterUsername,
                    patient,
                    healthRecordEntry.Type,
                    healthRecordEntry.Id,
                    storageOperation
                );
                await notificationsStore.StoreAsync(notification);
                await notificationsHub.Clients.User(subscription.Username).ReceiveNotification(notification);
            }
        }

        public async Task NotifyNewAdmission(
            Admission admission,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            var now = DateTime.UtcNow;
            var matchingSubscriptions = await subscriptionsStore.GetPatientSubscriptions(admission.ProfileData.Id);
            foreach (var subscription in matchingSubscriptions)
            {
                var notification = new AdmissionNotification(
                    Guid.NewGuid().ToString(),
                    subscription,
                    false,
                    now,
                    submitterUsername,
                    admission);
                await notificationsStore.StoreAsync(notification);
                await notificationsHub.Clients.User(subscription.Username).ReceiveNotification(notification);
            }
        }
    }
}
