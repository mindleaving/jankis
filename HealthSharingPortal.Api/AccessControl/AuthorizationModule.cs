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
        Task<PersonDataAccessGrant> GetAccessGrantForPerson(string personId, List<Claim> claims);
        Task<List<IPersonDataAccessGrant>> GetAccessGrants(List<Claim> claims);
    }

    internal class AuthorizationModule : IAuthorizationModule
    {
        private static readonly IList<AccessPermissions> EmergencyPermissions = new[] { AccessPermissions.Read, AccessPermissions.Create };
        private readonly IReadonlyStore<EmergencyAccess> emergencyAccessStore;
        private readonly IReadonlyStore<HealthProfessionalAccess> healthProfessionalAccessStore;
        private readonly IReadonlyStore<StudyAssociation> studyAssociationStore;
        private readonly IPersonDataReadonlyStore<StudyEnrollment> studyEnrollmentStore;

        public AuthorizationModule(
            IReadonlyStore<EmergencyAccess> emergencyAccessStore, 
            IReadonlyStore<HealthProfessionalAccess> healthProfessionalAccessStore, 
            IReadonlyStore<StudyAssociation> studyAssociationStore,
            IPersonDataReadonlyStore<StudyEnrollment> studyEnrollmentStore)
        {
            this.emergencyAccessStore = emergencyAccessStore;
            this.healthProfessionalAccessStore = healthProfessionalAccessStore;
            this.studyAssociationStore = studyAssociationStore;
            this.studyEnrollmentStore = studyEnrollmentStore;
        }

        public async Task<PersonDataAccessGrant> GetAccessGrantForPerson(
            string personId,
            List<Claim> claims)
        {
            var accountType = claims.TryGetAccountType();
            if (accountType == null)
            {
                return new PersonDataAccessGrant(personId, new List<AccessPermissions>());
            }
            if (accountType == AccountType.Admin)
            {
                // Admins don't have access to health data
                return new PersonDataAccessGrant(personId, new List<AccessPermissions>());
            }
            if (accountType == AccountType.Sharer)
            {
                var currentUserPersonId = claims.TryGetValue(JwtSecurityTokenBuilder.PersonIdClaimName);
                if (currentUserPersonId == personId)
                {
                    var allPermissions = Enum.GetValues<AccessPermissions>().Except(new[] { AccessPermissions.None }).ToList();
                    return new PersonDataAccessGrant(personId, allPermissions);
                }
            }
            else if (accountType == AccountType.EmergencyGuest)
            {
                var emergencyAccessId = claims.TryGetValue(JwtSecurityTokenBuilder.EmergencyAccessIdClaimName);
                var emergencyAccess = await emergencyAccessStore.GetByIdAsync(emergencyAccessId);
                if (!IsEmergencyAccessActive(emergencyAccess))
                    return new PersonDataAccessGrant(personId, new List<AccessPermissions>());
                var emergencyPersonId = claims.TryGetValue(JwtSecurityTokenBuilder.EmergencyPersonIdClaimName);
                if (emergencyPersonId == personId)
                {
                    var emergencyPermissions = claims.TryGetEmergencyPermissions(JwtSecurityTokenBuilder.EmergencyPermissionsClaimName);
                    return new PersonDataAccessGrant(personId, emergencyPermissions);
                }
            }
            else if (accountType == AccountType.HealthProfessional)
            {
                var utcNow = DateTime.UtcNow;
                var username = claims.TryGetValue(JwtSecurityTokenBuilder.UsernameClaimName);
                var activeAccesses = await healthProfessionalAccessStore
                    .SearchAsync(x => x.AccessReceiverUsername == username 
                                      && x.SharerPersonId == personId 
                                      && !x.IsRevoked 
                                      && (x.AccessEndTimestamp == null || x.AccessEndTimestamp > utcNow));
                if (activeAccesses.Any())
                {
                    var permissions = activeAccesses
                        .SelectMany(x => x.Permissions)
                        .Distinct()
                        .ToList();
                    return new PersonDataAccessGrant(personId, permissions);
                }
                var activeEmergencyAccesses = await emergencyAccessStore
                    .SearchAsync(x => x.AccessReceiverUsername == username 
                                      && x.SharerPersonId == personId 
                                      && !x.IsRevoked 
                                      && (x.AccessEndTimestamp == null || x.AccessEndTimestamp > utcNow));
                if (activeEmergencyAccesses.Any())
                {
                    return new PersonDataAccessGrant(personId, EmergencyPermissions);
                }
            }
            else if (accountType == AccountType.Researcher)
            {
                var username = claims.TryGetValue(JwtSecurityTokenBuilder.UsernameClaimName);
                var associatedStudies = await studyAssociationStore.SearchAsync(x => x.Username == username);
                var studyIds = associatedStudies.Select(x => x.StudyId).ToList();
                var studyEnrollments = 
                    studyIds.Count > 0
                    ? await studyEnrollmentStore.SearchAsync(
                        x => studyIds.Contains(x.StudyId) && x.PersonId == personId && x.State == StudyEnrollementState.Enrolled,
                        AccessGrantHelpers.GrantForPersonWithPermission(personId, AccessPermissions.Read))
                    : new List<StudyEnrollment>();
                if (studyEnrollments.Any())
                {
                    var permissions = studyEnrollments
                        .SelectMany(x => x.Permissions)
                        .Distinct()
                        .ToList();
                    return new PersonDataAccessGrant(personId, permissions);
                }
            }
            return new PersonDataAccessGrant(personId, new List<AccessPermissions>());
        }

        public async Task<List<IPersonDataAccessGrant>> GetAccessGrants(List<Claim> claims)
        {
            var accountType = claims.TryGetAccountType();
            if (accountType == null)
            {
                return new List<IPersonDataAccessGrant>();
            }
            if (accountType == AccountType.Admin)
            {
                // Admins don't have access to health data
                return new List<IPersonDataAccessGrant>();
            }
            if (accountType == AccountType.Sharer)
            {
                var currentUserPersonId = claims.TryGetValue(JwtSecurityTokenBuilder.PersonIdClaimName);
                var allPermissions = Enum.GetValues<AccessPermissions>().Except(new[] { AccessPermissions.None }).ToList();
                return new List<IPersonDataAccessGrant>
                {
                    new PersonDataAccessGrant(currentUserPersonId, allPermissions)
                };
            }

            if (accountType == AccountType.EmergencyGuest)
            {
                var emergencyAccessId = claims.TryGetValue(JwtSecurityTokenBuilder.EmergencyAccessIdClaimName);
                var emergencyAccess = await emergencyAccessStore.GetByIdAsync(emergencyAccessId);
                if (!IsEmergencyAccessActive(emergencyAccess))
                    return new List<IPersonDataAccessGrant>();
                var emergencyPersonId = claims.TryGetValue(JwtSecurityTokenBuilder.EmergencyPersonIdClaimName);
                var emergencyPermissions = claims.TryGetEmergencyPermissions(JwtSecurityTokenBuilder.EmergencyPermissionsClaimName);
                return new List<IPersonDataAccessGrant>
                {
                    new PersonDataAccessGrant(emergencyPersonId, emergencyPermissions)
                };
            }
            if (accountType == AccountType.HealthProfessional)
            {
                var utcNow = DateTime.UtcNow;
                var username = claims.TryGetValue(JwtSecurityTokenBuilder.UsernameClaimName);
                var activeAccesses = await healthProfessionalAccessStore
                    .SearchAsync(x => x.AccessReceiverUsername == username
                                      && !x.IsRevoked 
                                      && (x.AccessEndTimestamp == null || x.AccessEndTimestamp > utcNow));
                var activeEmergencyAccesses = await emergencyAccessStore
                    .SearchAsync(x => x.AccessReceiverUsername == username
                                      && !x.IsRevoked 
                                      && (x.AccessEndTimestamp == null || x.AccessEndTimestamp > utcNow));
                return activeAccesses.Select(x => new PersonDataAccessGrant(x.SharerPersonId, x.Permissions))
                    .Concat(activeEmergencyAccesses.Select(x => new PersonDataAccessGrant(x.SharerPersonId, EmergencyPermissions)))
                    .Cast<IPersonDataAccessGrant>()
                    .ToList();
            }
            if (accountType == AccountType.Researcher)
            {
                var username = claims.TryGetValue(JwtSecurityTokenBuilder.UsernameClaimName);
                var associatedStudies = await studyAssociationStore.SearchAsync(x => x.Username == username);
                var studyIds = associatedStudies.Select(x => x.StudyId).ToList();
                var studyEnrollments = studyIds.Count > 0
                    ? await studyEnrollmentStore.SearchAsync(
                        x => studyIds.Contains(x.StudyId) && x.State == StudyEnrollementState.Enrolled,
                        AccessGrantHelpers.GrantReadAccessToAllPersons())
                    : new List<StudyEnrollment>();
                return studyEnrollments
                    .Select(x => new PersonDataAccessGrant(x.PersonId, x.Permissions))
                    .Cast<IPersonDataAccessGrant>()
                    .ToList();
            }

            return new List<IPersonDataAccessGrant>();
        }

        private bool IsEmergencyAccessActive(EmergencyAccess emergencyAccess)
        {
            if (emergencyAccess == null)
                return false;
            if (emergencyAccess.IsRevoked)
                return false;
            if (emergencyAccess.AccessEndTimestamp != null && emergencyAccess.AccessEndTimestamp < DateTime.UtcNow)
                return false;
            return true;
        }
    }
}
