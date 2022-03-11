using Microsoft.AspNetCore.Authorization;

namespace HealthSharingPortal.Api.AccessControl
{
    public class AdminRequirement : IAuthorizationRequirement
    {
        public const string PolicyName = "Admin";
    }
}