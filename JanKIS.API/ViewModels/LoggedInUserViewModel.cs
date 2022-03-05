using System.Collections.Generic;
using HealthModels;
using JanKIS.API.Models;

namespace JanKIS.API.ViewModels
{
    public class LoggedInUserViewModel
    {
        public LoggedInUserViewModel(
            Person profileData,
            AuthenticationResult authenticationResult,
            string username,
            bool isPasswordResetRequired,
            AccountType accountType,
            List<Role> roles,
            List<Permission> permissions,
            List<Department> departments)
        {
            ProfileData = profileData;
            AuthenticationResult = authenticationResult;
            Username = username;
            IsPasswordResetRequired = isPasswordResetRequired;
            AccountType = accountType;
            Roles = roles ?? new List<Role>();
            Permissions = permissions ?? new List<Permission>();
            Departments = departments ?? new List<Department>();
        }

        public Person ProfileData { get; set; }
        public AuthenticationResult AuthenticationResult { get; set; }
        public string Username { get; set; }
        public bool IsPasswordResetRequired { get; set; }
        public AccountType AccountType { get; set; }
        public List<Role> Roles { get; set; }
        public List<Permission> Permissions { get; set; }
        public List<Department> Departments { get; }
    }
}
