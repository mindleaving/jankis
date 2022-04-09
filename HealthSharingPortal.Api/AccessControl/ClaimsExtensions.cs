using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using HealthModels.AccessControl;
using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.AccessControl
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

        public static IList<AccessPermissions> TryGetEmergencyPermissions(
            this List<Claim> claims,
            string claimType)
        {
            var permissionString = claims.Find(x => x.Type == claimType)?.Value;
            if (permissionString == null)
                return new List<AccessPermissions>();
            return permissionString.Split(JwtSecurityTokenBuilder.PermissionSeparator)
                .Select(Enum.Parse<AccessPermissions>)
                .ToList();
        }
    }
}
