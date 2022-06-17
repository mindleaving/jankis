using HealthModels;
using HealthModels.Interview;
using TypescriptGenerator.Attributes;

namespace HealthSharingPortal.API.Models
{
    public class ResearcherAccount : Account
    {
        public ResearcherAccount() {}
        public ResearcherAccount(
            string id,
            string personId = null,
            Language preferedLanguage = Language.en)
            : base(id, AccountType.Researcher, personId, preferedLanguage)
        {
        }

        [TypescriptIsOptional]
        public Address WorkAddress { get; set; }
        [TypescriptIsOptional]
        public string PhoneNumber { get; set; }
        [TypescriptIsOptional]
        public string Email { get; set; }
    }
}