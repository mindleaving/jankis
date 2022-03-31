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
        public static string GetUsername(IHttpContextAccessor httpContextAccessor)
        {
            var username = httpContextAccessor.HttpContext?.User.Claims
                .FirstOrDefault(x => x.Type == JwtSecurityTokenBuilder.UsernameClaimName)?.Value;
            if (username == null)
                return "anonymous";
            return UsernameNormalizer.Normalize(username);
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
    }
}
