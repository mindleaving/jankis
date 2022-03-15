using Microsoft.AspNetCore.Authorization;

namespace HealthSharingPortal.API.AccessControl
{
    public class AdminRequirement : IAuthorizationRequirement
    {
        public const string PolicyName = "Admin";
    }
}