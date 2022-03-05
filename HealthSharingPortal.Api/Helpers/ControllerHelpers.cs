using System.Linq;
using HealthSharingPortal.Api.AccessControl;
using Microsoft.AspNetCore.Http;

namespace HealthSharingPortal.Api.Helpers
{
    internal static class ControllerHelpers
    {
        public static string GetUsername(IHttpContextAccessor httpContextAccessor)
        {
            var username = httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == "id")?.Value;
            if (username == null)
                return "anonymous";
            return UsernameNormalizer.Normalize(username);
        }
    }
}
