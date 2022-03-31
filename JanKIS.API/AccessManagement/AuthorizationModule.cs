using System;
using System.Linq;
using System.Threading.Tasks;
using HealthModels.AccessControl;
using JanKIS.API.Models;
using JanKIS.API.Storage;

namespace JanKIS.API.AccessManagement
{
    public interface IAuthorizationModule
    {
        Task<bool> HasPermissionForPerson(
            string personId,
            AccountType accountType,
            string username,
            string currentUserPersonId);
    }

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
            AccountType accountType,
            string username,
            string currentUserPersonId)
        {
            if (accountType == AccountType.Patient)
            {
                return currentUserPersonId == personId;
            }
            if (accountType == AccountType.Employee)
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
            return false;
        }
    }
}
