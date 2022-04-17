using HealthModels;
using HealthModels.Interview;
using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.ViewModels
{
    public class LoggedInUserViewModel : IUserViewModel
    {
        public LoggedInUserViewModel(
            Person profileData,
            Account account)
        {
            ProfileData = profileData;
            Account = account;
        }

        public Person ProfileData { get; set; }
        public Account Account { get; set; }
        public string AccountType => (Account?.AccountType ?? Models.AccountType.Undefined).ToString();
        public string AccountId => Account?.Id;
        public Language PreferedLanguage => Account?.PreferedLanguage ?? Language.en;
    }
}
