using HealthModels;
using HealthSharingPortal.Api.Models;

namespace HealthSharingPortal.Api.ViewModels
{
    public class AccountViewModel : IViewModel<Account>
    {
        public AccountViewModel(string username,
            AccountType accountType,
            Person profileData)
        {
            Username = username;
            AccountType = accountType;
            ProfileData = profileData;
        }

        public string Username { get; }
        public AccountType AccountType { get; }
        public Person ProfileData { get; }
    }
}
