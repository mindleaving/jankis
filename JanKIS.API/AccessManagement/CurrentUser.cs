using System.Collections.Generic;
using JanKIS.API.Models;

namespace JanKIS.API.AccessManagement
{
    public class CurrentUser
    {
        public CurrentUser(
            string username,
            AccountType? accountType,
            List<Permission> permissions)
        {
            Username = username;
            AccountType = accountType;
            Permissions = permissions;
        }

        public string Username { get; }
        public AccountType? AccountType { get; }
        public List<Permission> Permissions { get; }
    }
}
