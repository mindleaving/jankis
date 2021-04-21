using System;
using System.Threading.Tasks;
using JanKIS.API.Hubs;
using JanKIS.API.Models;
using JanKIS.API.Models.Subscriptions;
using JanKIS.API.Storage;
using Microsoft.AspNetCore.SignalR;

namespace JanKIS.API.Workflow
{
    public interface INotificationDistributor
    {
        Task NotifyNewPatientEvent(IPatientEvent patientEvent, StorageOperation storageOperation, string submitterUsername);
        Task NotifyNewAdmission(Admission admission, StorageOperation storageOperation, string submitterUsername);
        Task NotifyNewBedOccupancy(BedOccupancy bedOccupancy, StorageOperation storageOperation, string submitterUsername);
        Task NotifyNewServiceRequest(ServiceRequest serviceRequest, StorageOperation storageOperation, string submitterUsername); 
        Task NotifyNewService(ServiceDefinition service, StorageOperation storageOperation, string submitterUsername);
    }

    public class NotificationDistributor : INotificationDistributor
    {
        private readonly INotificationsStore notificationsStore;
        private readonly ISubscriptionsStore subscriptionsStore;
        private readonly IHubContext<NotificationsHub, INotificationsClient> notificationsHub;
        private readonly IReadonlyStore<Person> personsStore;

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
            IPatientEvent patientEvent,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            var now = DateTime.UtcNow;
            var patient = await personsStore.GetByIdAsync(patientEvent.PatientId);
            var matchingSubscriptions = await subscriptionsStore.GetPatientSubscriptions(patientEvent.PatientId);
            foreach (var subscription in matchingSubscriptions)
            {
                var notification = new PatientEventNotification(
                    Guid.NewGuid().ToString(),
                    subscription,
                    false,
                    now,
                    submitterUsername,
                    patient,
                    patientEvent.Type,
                    patientEvent.Id,
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
            var matchingSubscriptions = await subscriptionsStore.GetPatientSubscriptions(admission.PatientId);
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
