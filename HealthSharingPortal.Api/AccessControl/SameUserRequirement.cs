using Microsoft.AspNetCore.Authorization;

namespace HealthSharingPortal.API.AccessControl
{
    public class SameUserRequirement : IAuthorizationRequirement
    {
        public const string PolicyName = "SameUser";

        public SameUserRequirement(string routeParameterName)
        {
            RouteParameterName = routeParameterName;
        }

        public string RouteParameterName { get; set; }
    }
}