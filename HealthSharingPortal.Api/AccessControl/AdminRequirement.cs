using Microsoft.AspNetCore.Authorization;

namespace HealthSharingPortal.API.AccessControl
{
    internal class AdminRequirement : IAuthorizationRequirement
    {
        public const string PolicyName = "Admin";
    }
}