using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace HealthSharingPortal.API.AccessControl
{
    public class SameUserRequirementHandler : AuthorizationHandler<SameUserRequirement>
    {
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            SameUserRequirement requirement)
        {
            var httpContext = context.Resource as HttpContext;
            var username = httpContext.Request.RouteValues[requirement.RouteParameterName] as string;
            if (username != null)
            {
                if (context.User.HasClaim("id", username))
                {
                    context.Succeed(requirement);
                }
            }
            return Task.CompletedTask;
        }
    }
}
