using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using HealthModels.AccessControl;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;

namespace HealthSharingPortal.API.AccessControl
{
    public interface IAuthorizationModule
    {
        Task<bool> HasPermissionForPerson(
            string personId,
            List<Claim> claims);
    }

    internal class AuthorizationModule : IAuthorizationModule
    {
        private readonly IReadonlyStore<EmergencyAccess> emergencyAccessStore;
        private readonly IReadonlyStore<HealthProfessionalAccess> healthProfessionalAccessStore;
        private readonly IReadonlyStore<StudyAssociation> studyAssociationStore;
        private readonly IReadonlyStore<StudyEnrollment> studyEnrollmentStore;

        public AuthorizationModule(
            IReadonlyStore<EmergencyAccess> emergencyAccessStore, 
            IReadonlyStore<HealthProfessionalAccess> healthProfessionalAccessStore, 
            IReadonlyStore<StudyAssociation> studyAssociationStore,
            IReadonlyStore<StudyEnrollment> studyEnrollmentStore)
        {
            this.emergencyAccessStore = emergencyAccessStore;
            this.healthProfessionalAccessStore = healthProfessionalAccessStore;
            this.studyAssociationStore = studyAssociationStore;
            this.studyEnrollmentStore = studyEnrollmentStore;
        }

        public async Task<bool> HasPermissionForPerson(
            string personId,
            List<Claim> claims)
        {
            var accountType = claims.TryGetAccountType();
            if (accountType == null)
                return false;
            if (accountType == AccountType.Admin)
            {
                return false; // Admins don't have access to health data
            }
            if (accountType == AccountType.Sharer)
            {
                var currentUserPersonId = claims.TryGetValue(JwtSecurityTokenBuilder.PersonIdClaimName);
                return currentUserPersonId == personId;
            }
            if (accountType == AccountType.HealthProfessional)
            {
                var utcNow = DateTime.UtcNow;
                var username = claims.TryGetValue(JwtSecurityTokenBuilder.UsernameClaimName);
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
            if (accountType == AccountType.Researcher)
            {
                var username = claims.TryGetValue(JwtSecurityTokenBuilder.UsernameClaimName);
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
