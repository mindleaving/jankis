using System;
using System.Linq;
using JanKIS.API.AccessManagement;
using JanKIS.API.Models;
using Microsoft.AspNetCore.Http;

namespace JanKIS.API.Helpers
{
    internal static class ControllerHelpers
    {
        public static string GetUsername(IHttpContextAccessor httpContextAccessor)
        {
            var username = httpContextAccessor.HttpContext?.User.Claims
                .FirstOrDefault(x => x.Type == JwtSecurityTokenBuilder.UsernameClaimName)?.Value;
            if (username == null)
                return "anonymous";
            return UsernameNormalizer.Normalize(username);
        }

        public static AccountType? GetAccountType(IHttpContextAccessor httpContextAccessor)
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
    }
}
