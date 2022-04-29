﻿using System;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.AccessControl;
using HealthModels.Medication;
using HealthModels.Services;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Hubs;
using HealthSharingPortal.API.Models.Subscriptions;
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
        private readonly IPersonDataReadonlyStore<Person> personsStore;

        public NotificationDistributor(
            Storage.INotificationsStore notificationsStore,
            Storage.ISubscriptionsStore subscriptionsStore,
            IHubContext<NotificationsHub, INotificationsClient> notificationsHub,
            IPersonDataReadonlyStore<Person> personsStore)
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
            var patient = await personsStore.GetByIdAsync(
                healthRecordEntry.PersonId,
                AccessGrantHelpers.GrantForPersonWithPermission(healthRecordEntry.PersonId, AccessPermissions.Read));
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
                await notificationsHub.Clients.User(subscription.AccountId).ReceiveNotification(notification);
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
                await notificationsHub.Clients.User(subscription.AccountId).ReceiveNotification(notification);
            }
        }

        public async Task NotifyMedicationScheduleChanged(
            MedicationSchedule medicationSchedule,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            var now = DateTime.UtcNow;
            var personId = medicationSchedule.PersonId;
            var patient = await personsStore.GetByIdAsync(
                personId, 
                AccessGrantHelpers.GrantForPersonWithPermission(personId, AccessPermissions.Read));
            var matchingSubscriptions = await subscriptionsStore.GetPatientSubscriptions(personId);
            foreach (var subscription in matchingSubscriptions)
            {
                var notification = new MedicationScheduleNotification(
                    Guid.NewGuid().ToString(),
                    subscription,
                    false,
                    now,
                    submitterUsername,
                    patient,
                    medicationSchedule.Id,
                    storageOperation
                );
                await notificationsStore.StoreAsync(notification);
                await notificationsHub.Clients.User(subscription.AccountId).ReceiveNotification(notification);
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
                await notificationsHub.Clients.User(subscription.AccountId).ReceiveNotification(notification);
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
                await notificationsHub.Clients.User(subscription.AccountId).ReceiveNotification(notification);
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
                await notificationsHub.Clients.User(subscription.AccountId).ReceiveNotification(notification);
            }
        }
    }
}
