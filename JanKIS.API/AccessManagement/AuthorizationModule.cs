using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using HealthModels.AccessControl;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Storage;
using JanKIS.API.Models;

namespace JanKIS.API.AccessManagement
{
    public class AuthorizationModule : IAuthorizationModule
    {
        private static readonly IList<AccessPermissions> EmergencyPermissions = new[] { AccessPermissions.Read, AccessPermissions.Create };
        private readonly IReadonlyStore<EmergencyAccess> emergencyAccessStore;
        private readonly IReadonlyStore<HealthProfessionalAccess> healthProfessionalAccessStore;

        public AuthorizationModule(
            IReadonlyStore<EmergencyAccess> emergencyAccessStore, 
            IReadonlyStore<HealthProfessionalAccess> healthProfessionalAccessStore)
        {
            this.emergencyAccessStore = emergencyAccessStore;
            this.healthProfessionalAccessStore = healthProfessionalAccessStore;
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
            if (accountType == AccountType.Patient)
            {
                var currentUserPersonId = claims.TryGetValue(JwtSecurityTokenBuilder.PersonIdClaimName);
                if (currentUserPersonId == personId)
                {
                    var allPermissions = Enum.GetValues<AccessPermissions>().Except(new[] { AccessPermissions.None }).ToList();
                    return new PersonDataAccessGrant(personId, allPermissions);
                }
            }
            if (accountType == AccountType.Employee)
            {
                var utcNow = DateTime.UtcNow;
                var username = claims.TryGetValue(JwtSecurityTokenBuilder.AccoundIdClaimName);
                var activeAccesses = await healthProfessionalAccessStore
                    .SearchAsync(x => x.AccessReceiverAccountId == username 
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
                    .SearchAsync(x => x.AccessReceiverAccountId == username 
                                      && x.SharerPersonId == personId 
                                      && !x.IsRevoked 
                                      && (x.AccessEndTimestamp == null || x.AccessEndTimestamp > utcNow));
                if (activeEmergencyAccesses.Any())
                {
                    return new PersonDataAccessGrant(personId, EmergencyPermissions);
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
            if (accountType == AccountType.Patient)
            {
                var currentUserPersonId = claims.TryGetValue(JwtSecurityTokenBuilder.PersonIdClaimName);
                var allPermissions = Enum.GetValues<AccessPermissions>().Except(new[] { AccessPermissions.None }).ToList();
                return new List<IPersonDataAccessGrant>
                {
                    new PersonDataAccessGrant(currentUserPersonId, allPermissions)
                };
            }
            if (accountType == AccountType.Employee)
            {
                var utcNow = DateTime.UtcNow;
                var username = claims.TryGetValue(JwtSecurityTokenBuilder.AccoundIdClaimName);
                var activeAccesses = await healthProfessionalAccessStore
                    .SearchAsync(x => x.AccessReceiverAccountId == username
                                      && !x.IsRevoked 
                                      && (x.AccessEndTimestamp == null || x.AccessEndTimestamp > utcNow));
                var activeEmergencyAccesses = await emergencyAccessStore
                    .SearchAsync(x => x.AccessReceiverAccountId == username
                                      && !x.IsRevoked 
                                      && (x.AccessEndTimestamp == null || x.AccessEndTimestamp > utcNow));
                return activeAccesses.Select(x => new PersonDataAccessGrant(x.SharerPersonId, x.Permissions))
                    .Concat(activeEmergencyAccesses.Select(x => new PersonDataAccessGrant(x.SharerPersonId, EmergencyPermissions)))
                    .Cast<IPersonDataAccessGrant>()
                    .ToList();
            }

            return new List<IPersonDataAccessGrant>();
        }
    }
}
