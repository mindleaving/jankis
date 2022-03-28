using HealthModels;
using HealthModels.Interview;
using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.ViewModels
{
    public class LoggedInUserViewModel
    {
        public LoggedInUserViewModel(
            Person profileData,
            AuthenticationResult authenticationResult,
            string username,
            bool isPasswordResetRequired,
            AccountType accountType,
            Language preferedLanguage)
        {
            ProfileData = profileData;
            AuthenticationResult = authenticationResult;
            Username = username;
            IsPasswordResetRequired = isPasswordResetRequired;
            AccountType = accountType;
            PreferedLanguage = preferedLanguage;
        }

        public Person ProfileData { get; set; }
        public AuthenticationResult AuthenticationResult { get; set; }
        public string Username { get; set; }
        public bool IsPasswordResetRequired { get; set; }
        public AccountType AccountType { get; set; }
        public Language PreferedLanguage { get; set; } = Language.en;
    }
}
