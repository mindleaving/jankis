using System.Collections.Generic;
using HealthModels;
using HealthSharingPortal.API.ViewModels;
using JanKIS.API.Models;

namespace JanKIS.API.ViewModels
{
    public class AccountViewModel : IViewModel<Account>
    {
        public AccountViewModel(string username,
            AccountType accountType,
            Person profileData,
            List<Role> roles = null,
            List<PermissionModifier> permissionModifiers = null,
            List<Department> departments = null)
        {
            Username = username;
            AccountType = accountType;
            ProfileData = profileData;
            Roles = roles ?? new List<Role>();
            PermissionModifiers = permissionModifiers ?? new List<PermissionModifier>();
            Departments = departments ?? new List<Department>();
        }

        public string Username { get; }
        public AccountType AccountType { get; }
        public Person ProfileData { get; }
        public List<Role> Roles { get; }
        public List<PermissionModifier> PermissionModifiers { get; }
        public List<Department> Departments { get; }
    }
}
