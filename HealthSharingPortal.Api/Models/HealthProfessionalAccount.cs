using HealthModels;

namespace HealthSharingPortal.API.Models
{
    public class HealthProfessionalAccount : Account
    {
        public HealthProfessionalAccount(
            string personId,
            string username,
            AccountType accountType,
            string salt,
            string passwordHash)
            : base(
                personId, 
                username, 
                accountType,
                salt,
                passwordHash)
        {
        }

        public Address WorkAddress { get; set; }
        public bool CanRequestEmergencyAccess { get; set; }
    }
}