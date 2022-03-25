﻿using System;
using System.Linq;
using System.Threading.Tasks;
using HealthModels.AccessControl;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;

namespace HealthSharingPortal.API.AccessControl
{
    public interface IAuthorizationModule
    {
        Task<bool> HasPermissionForPerson(string personId, string username);
    }

    public class AuthorizationModule : IAuthorizationModule
    {
        private readonly IReadonlyStore<Account> accountStore;
        private readonly IReadonlyStore<EmergencyAccess> emergencyAccessStore;
        private readonly IReadonlyStore<HealthProfessionalAccess> healthProfessionalAccessStore;
        private readonly IReadonlyStore<StudyAssociation> studyAssociationStore;
        private readonly IReadonlyStore<StudyEnrollment> studyEnrollmentStore;

        public AuthorizationModule(
            IReadonlyStore<Account> accountStore, 
            IReadonlyStore<EmergencyAccess> emergencyAccessStore, 
            IReadonlyStore<HealthProfessionalAccess> healthProfessionalAccessStore, 
            IReadonlyStore<StudyAssociation> studyAssociationStore,
            IReadonlyStore<StudyEnrollment> studyEnrollmentStore)
        {
            this.accountStore = accountStore;
            this.emergencyAccessStore = emergencyAccessStore;
            this.healthProfessionalAccessStore = healthProfessionalAccessStore;
            this.studyAssociationStore = studyAssociationStore;
            this.studyEnrollmentStore = studyEnrollmentStore;
        }

        public async Task<bool> HasPermissionForPerson(string personId, string username)
        {
            var account = await accountStore.GetByIdAsync(username);
            if (account.AccountType == AccountType.Admin)
            {
                return false; // Admins don't have access to health data
            }
            if (account.AccountType == AccountType.Sharer)
            {
                return account.PersonId == personId;
            }
            if (account.AccountType == AccountType.HealthProfessional)
            {
                var utcNow = DateTime.UtcNow;
                var activeEmergencyAccesses = await emergencyAccessStore
                    .SearchAsync(x => x.AccessReceiverUsername == username 
                                      && x.SharerPersonId == personId 
                                      && !x.IsRevoked 
                                      && (x.AccessEndTimestamp == null || x.AccessEndTimestamp > utcNow));
                if (activeEmergencyAccesses.Any())
                    return true;
                var activeAccesses = await healthProfessionalAccessStore
                    .SearchAsync(x => x.AccessReceiverUsername == username 
                                      && x.SharerPersonId == personId 
                                      && !x.IsRevoked 
                                      && (x.AccessEndTimestamp == null || x.AccessEndTimestamp > utcNow));
                return activeAccesses.Any();
            }
            if (account.AccountType == AccountType.Researcher)
            {
                var associatedStudies = await studyAssociationStore.SearchAsync(x => x.Username == username);
                var studyIds = associatedStudies.Select(x => x.StudyId).ToList();
                var studyEnrollments = await studyEnrollmentStore
                    .SearchAsync(x => studyIds.Contains(x.StudyId) && x.PersonId == personId && x.State == StudyEnrollementState.Enrolled);
                return studyEnrollments.Any();
            }
            return false;
        }
    }
}