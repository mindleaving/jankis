using HealthModels;
using HealthModels.Interview;
using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.ViewModels
{
    public class GuestViewModel : IUserViewModel
    {
        public GuestViewModel(
            Person profileData,
            AuthenticationResult authenticationResult,
            AccountType accountType,
            Language preferedLanguage = Language.en)
        {
            ProfileData = profileData;
            AuthenticationResult = authenticationResult;
            AccountType = accountType.ToString();
            PreferedLanguage = preferedLanguage;
        }

        public Person ProfileData { get; set; }
        public AuthenticationResult AuthenticationResult { get; set; }
        public string AccountType { get; set; }
        public string AccountId => "guest";
        public Language PreferedLanguage { get; set; }
    }
}