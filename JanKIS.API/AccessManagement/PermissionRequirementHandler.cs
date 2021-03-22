using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace JanKIS.API.AccessManagement
{
    public class PermissionRequirementHandler : AuthorizationHandler<PermissionRequirement>
    {
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            PermissionRequirement requirement)
        {
            if (context.User.HasClaim(c => 
                c.Type.Equals(requirement.Permission.ToString(), StringComparison.InvariantCultureIgnoreCase)
                && c.Value == "true")
            )
            {
                context.Succeed(requirement);
            }
            return Task.CompletedTask;
        }
    }
}