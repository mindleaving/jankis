using HealthModels;
using HealthModels.Interview;

namespace HealthSharingPortal.API.Models
{
    public class HealthProfessionalAccount : Account
    {
        public HealthProfessionalAccount() {}
        public HealthProfessionalAccount(
            string id,
            string personId = null,
            Language preferedLanguage = Language.en)
            : base(id, AccountType.HealthProfessional, personId, preferedLanguage)
        {
        }

        public Address WorkAddress { get; set; }
        public bool CanRequestEmergencyAccess { get; set; }
    }
}