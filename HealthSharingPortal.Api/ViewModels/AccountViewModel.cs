using HealthModels;
using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.ViewModels
{
    public class AccountViewModel : IViewModel<Account>
    {
        public AccountViewModel(
            string accountId,
            AccountType accountType,
            Person profileData)
        {
            AccountId = accountId;
            AccountType = accountType;
            ProfileData = profileData;
        }

        public string AccountId { get; }
        public AccountType AccountType { get; }
        public Person ProfileData { get; }
        public bool IsPasswordChangeRequired { get; set; }
    }
}
