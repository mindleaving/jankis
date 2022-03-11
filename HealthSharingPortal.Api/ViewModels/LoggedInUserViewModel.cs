using HealthModels;
using HealthSharingPortal.Api.Models;

namespace HealthSharingPortal.Api.ViewModels
{
    public class LoggedInUserViewModel
    {
        public LoggedInUserViewModel(
            Person profileData,
            AuthenticationResult authenticationResult,
            string username,
            bool isPasswordResetRequired,
            AccountType accountType)
        {
            ProfileData = profileData;
            AuthenticationResult = authenticationResult;
            Username = username;
            IsPasswordResetRequired = isPasswordResetRequired;
            AccountType = accountType;
        }

        public Person ProfileData { get; set; }
        public AuthenticationResult AuthenticationResult { get; set; }
        public string Username { get; set; }
        public bool IsPasswordResetRequired { get; set; }
        public AccountType AccountType { get; set; }
    }
}
