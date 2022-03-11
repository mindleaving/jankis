using System.Threading.Tasks;
using HealthSharingPortal.Api.Models;
using Microsoft.AspNetCore.Authorization;

namespace HealthSharingPortal.Api.AccessControl
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