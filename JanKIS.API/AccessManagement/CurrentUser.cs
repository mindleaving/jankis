using System.Collections.Generic;
using JanKIS.API.Models;

namespace JanKIS.API.AccessManagement
{
    public class CurrentUser
    {
        public CurrentUser(
            string username,
            AccountType? accountType,
            List<Permission> permissions,
            string personId,
            List<string> departmentIds)
        {
            Username = username;
            AccountType = accountType;
            Permissions = permissions;
            DepartmentIds = departmentIds;
            PersonId = personId;
        }

        public string Username { get; }
        public AccountType? AccountType { get; }
        public List<Permission> Permissions { get; }
        public string PersonId { get; }
        public List<string> DepartmentIds { get; }
    }
}
