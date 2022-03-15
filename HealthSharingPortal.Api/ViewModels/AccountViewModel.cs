using HealthModels;
using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.ViewModels
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
