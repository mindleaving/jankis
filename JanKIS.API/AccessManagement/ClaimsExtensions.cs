using System;
using System.Collections.Generic;
using System.Security.Claims;
using JanKIS.API.Models;

namespace JanKIS.API.AccessManagement
{
    public static class ClaimsExtensions
    {
        public static string TryGetValue(
            this List<Claim> claims,
            string claimType)
        {
            return claims.Find(x => x.Type == claimType)?.Value;
        }

        public static AccountType? TryGetAccountType(this List<Claim> claims)
        {
            var matchingClaim = claims.Find(x => x.Type == JwtSecurityTokenBuilder.AccountTypeClaimName);
            if (matchingClaim == null)
                return null;
            return Enum.Parse<AccountType>(matchingClaim.Value);
        }
    }
}
