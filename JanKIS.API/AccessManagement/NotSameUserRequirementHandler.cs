using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace JanKIS.API.AccessManagement
{
    public class NotSameUserRequirementHandler : AuthorizationHandler<NotSameUserRequirement>
    {
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            NotSameUserRequirement requirement)
        {
            var httpContext = context.Resource as HttpContext;
            var username = httpContext.Request.RouteValues[requirement.RouteParameterName] as string;
            if (username != null)
            {
                if (!context.User.HasClaim("id", username))
                {
                    context.Succeed(requirement);
                }
            }
            return Task.CompletedTask;
        }
    }

    public class NotSameUserRequirement : IAuthorizationRequirement
    {
        public const string PolicyName = "NotSameUser";

        public NotSameUserRequirement(string routeParameterName)
        {
            RouteParameterName = routeParameterName;
        }

        public string RouteParameterName { get; set; }
    }
}
