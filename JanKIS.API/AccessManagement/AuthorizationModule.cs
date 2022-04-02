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
        private readonly IReadonlyStore<EmergencyAccess> emergencyAccessStore;
        private readonly IReadonlyStore<HealthProfessionalAccess> healthProfessionalAccessStore;

        public AuthorizationModule(
            IReadonlyStore<EmergencyAccess> emergencyAccessStore, 
            IReadonlyStore<HealthProfessionalAccess> healthProfessionalAccessStore)
        {
            this.emergencyAccessStore = emergencyAccessStore;
            this.healthProfessionalAccessStore = healthProfessionalAccessStore;
        }

        public async Task<bool> HasPermissionForPerson(
            string personId,
            List<Claim> claims)
        {
            var accountType = claims.TryGetAccountType();
            if (accountType == null)
                return false;
            if (accountType == AccountType.Patient)
            {
                var currentUserPersonId = claims.TryGetValue(JwtSecurityTokenBuilder.PersonIdClaimName);
                return currentUserPersonId == personId;
            }
            if (accountType == AccountType.Employee)
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
            return false;
        }
    }
}
