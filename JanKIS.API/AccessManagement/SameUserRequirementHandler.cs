using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace JanKIS.API.AccessManagement
{
    public class SameUserRequirementHandler : AuthorizationHandler<SameUserRequirement>
    {
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            SameUserRequirement requirement)
        {
            var httpContext = context.Resource as HttpContext;
            var employeeId = httpContext.Request.RouteValues[requirement.RouteParameterName] as string;
            if (employeeId != null)
            {
                if (context.User.HasClaim("id", employeeId))
                {
                    context.Succeed(requirement);
                }
            }
            return Task.CompletedTask;
        }
    }

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
