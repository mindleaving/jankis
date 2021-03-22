using JanKIS.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace JanKIS.API.AccessManagement
{
    public class PermissionRequirement : IAuthorizationRequirement
    {
        public Permission Permission { get; }

        public PermissionRequirement(Permission permission)
        {
            Permission = permission;
        }
    }
}
