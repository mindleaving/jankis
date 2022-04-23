using System.Collections.Generic;
using HealthModels;
using HealthModels.Interview;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.ViewModels;
using JanKIS.API.Models;
using Account = JanKIS.API.Models.Account;

namespace JanKIS.API.ViewModels
{
    public class LoggedInUserViewModel : IUserViewModel
    {
        public LoggedInUserViewModel(
            Person profileData,
            AuthenticationResult authenticationResult,
            Account account,
            List<Role> roles,
            List<Permission> permissions,
            List<Department> departments)
        {
            ProfileData = profileData;
            AuthenticationResult = authenticationResult;
            Account = account;
            Roles = roles ?? new List<Role>();
            Permissions = permissions ?? new List<Permission>();
            Departments = departments ?? new List<Department>();
        }

        public Person ProfileData { get; set; }
        public Account Account { get; set; }
        public AuthenticationResult AuthenticationResult { get; set; }
        public string AccountId => Account?.Id;
        public Language PreferedLanguage => Account?.PreferedLanguage ?? Language.en;
        public bool IsPasswordResetRequired => AuthenticationResult?.IsPasswordChangeRequired ?? false;
        public string AccountType => (Account?.AccountType ?? Models.AccountType.Undefined).ToString();
        public List<Role> Roles { get; set; }
        public List<Permission> Permissions { get; set; }
        public List<Department> Departments { get; set; }
    }
}
