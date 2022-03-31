using System;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Services;
using HealthSharingPortal.API.Hubs;
using HealthSharingPortal.API.Storage;
using JanKIS.API.Models;
using JanKIS.API.Models.Subscriptions;
using Microsoft.AspNetCore.SignalR;

namespace JanKIS.API.Workflow
{
    public interface INotificationDistributor : HealthSharingPortal.API.Workflow.INotificationDistributor
    {
        Task NotifyNewBedOccupancy(BedOccupancy bedOccupancy, StorageOperation storageOperation, string submitterUsername);
        Task NotifyNewServiceRequest(ServiceRequest serviceRequest, StorageOperation storageOperation, string submitterUsername);
        Task NotifyNewService(ServiceDefinition service, StorageOperation storageOperation, string submitterUsername);
    }

    public class NotificationDistributor : INotificationDistributor
    {
        private readonly Storage.INotificationsStore notificationsStore;
        private readonly Storage.ISubscriptionsStore subscriptionsStore;
        private readonly IHubContext<NotificationsHub, INotificationsClient> notificationsHub;
        private readonly IReadonlyStore<Person> personsStore;

        public NotificationDistributor(
            Storage.INotificationsStore notificationsStore,
            Storage.ISubscriptionsStore subscriptionsStore,
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

        public async Task NotifyNewBedOccupancy(
            BedOccupancy bedOccupancy,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            var now = DateTime.UtcNow;
            var matchingSubscriptions = await subscriptionsStore.GetDepartmentSubscriptions(bedOccupancy.Department.Id);
            foreach (var subscription in matchingSubscriptions)
            {
                var notification = new BedOccupancyNotification(
                    Guid.NewGuid().ToString(),
                    subscription,
                    false,
                    now,
                    submitterUsername,
                    bedOccupancy
                );
                await notificationsStore.StoreAsync(notification);
                await notificationsHub.Clients.User(subscription.Username).ReceiveNotification(notification);
            }
        }

        public async Task NotifyNewServiceRequest(
            ServiceRequest serviceRequest,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            var now = DateTime.UtcNow;
            var matchingSubscriptions = await subscriptionsStore.GetServiceRequestSubscriptions(serviceRequest.Id);
            foreach (var subscription in matchingSubscriptions)
            {
                var notification = new ServiceRequestNotification(
                    Guid.NewGuid().ToString(),
                    subscription,
                    false,
                    now,
                    submitterUsername,
                    serviceRequest.Id
                );
                await notificationsStore.StoreAsync(notification);
                await notificationsHub.Clients.User(subscription.Username).ReceiveNotification(notification);
            }
        }

        public async Task NotifyNewService(
            ServiceDefinition service,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            var now = DateTime.UtcNow;
            var matchingSubscriptions = await subscriptionsStore.GetServiceSubscriptions(service.Id);
            foreach (var subscription in matchingSubscriptions)
            {
                var notification = new ServiceNotification(
                    Guid.NewGuid().ToString(),
                    subscription,
                    false,
                    now,
                    submitterUsername,
                    service
                );
                await notificationsStore.StoreAsync(notification);
                await notificationsHub.Clients.User(subscription.Username).ReceiveNotification(notification);
            }
        }
    }
}
