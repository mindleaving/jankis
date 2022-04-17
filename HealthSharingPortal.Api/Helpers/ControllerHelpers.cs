using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Models;
using Microsoft.AspNetCore.Http;

namespace HealthSharingPortal.API.Helpers
{
    public static class ControllerHelpers
    {
        public static string GetAccountId(IHttpContextAccessor httpContextAccessor)
        {
            var accountId = httpContextAccessor.HttpContext?.User.Claims
                .FirstOrDefault(x => x.Type == JwtSecurityTokenBuilder.AccountIdClaimName)?.Value;
            if (accountId == null)
                return null;
            return UsernameNormalizer.Normalize(accountId);
        }

        internal static AccountType? GetAccountType(IHttpContextAccessor httpContextAccessor)
        {
            var accountTypeString = httpContextAccessor.HttpContext?.User.Claims
                .FirstOrDefault(x => x.Type == JwtSecurityTokenBuilder.AccountTypeClaimName)?.Value;
            if (accountTypeString == null)
                return null;
            return Enum.Parse<AccountType>(accountTypeString);
        }

        public static string GetPersonId(IHttpContextAccessor httpContextAccessor)
        {
            return httpContextAccessor.HttpContext?.User.Claims
                .FirstOrDefault(x => x.Type == JwtSecurityTokenBuilder.PersonIdClaimName)?.Value;
        }

        public static List<Claim> GetClaims(IHttpContextAccessor httpContextAccessor)
        {
            return httpContextAccessor.HttpContext?.User.Claims.ToList() ?? new List<Claim>();
        }

        public static bool IsLoggedIn(IHttpContextAccessor httpContextAccessor)
        {
            var user = httpContextAccessor.HttpContext?.User;
            if(user?.Identity == null)
            {
                return false;
            }
            if (!user.Identity.IsAuthenticated)
            {
                return false;
            }
            return true;
        }
    }
}
