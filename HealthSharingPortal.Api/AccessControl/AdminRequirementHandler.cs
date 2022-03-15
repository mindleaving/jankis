using System.Threading.Tasks;
using HealthSharingPortal.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace HealthSharingPortal.API.AccessControl
{
    public class AdminRequirementHandler : AuthorizationHandler<AdminRequirement>
    {
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            AdminRequirement requirement)
        {
            if (context.User.HasClaim(JwtSecurityTokenBuilder.AccountTypeClaimName, AccountType.Admin.ToString()))
            {
                context.Succeed(requirement);
            }
            return Task.CompletedTask;
        }
    }
}