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

        public static LoginProvider GetLoginProvider(this IEnumerable<Claim> claims)
        {
            var issuer = claims.Select(x => x.Issuer).Distinct().Single();
            return issuer switch
            {
                "Facebook" => LoginProvider.Facebook,
                "Google" => LoginProvider.Google,
                "Microsoft" => LoginProvider.Microsoft,
                "Twitter" => LoginProvider.Twitter,
                JwtSecurityTokenBuilder.Issuer => LoginProvider.LocalJwt,
                _ => throw new NotImplementedException()
            };
        }

        public static string GetExternalId(this List<Claim> claims)
        {
            var loginProvider = GetLoginProvider(claims);
            return GetExternalId(claims, loginProvider);
        }

        public static string GetExternalId(
            this IEnumerable<Claim> claims,
            LoginProvider loginProvider)
        {
            var loginProviderClaims = claims.Where(x => x.Issuer == GetIssuer(loginProvider)).ToList();
            switch (loginProvider)
            {
                case LoginProvider.Unknown:
                    throw new Exception($"Invalid login provider '{loginProvider}'");
                case LoginProvider.Google:
                case LoginProvider.LocalJwt:
                case LoginProvider.Twitter:
                case LoginProvider.Microsoft:
                case LoginProvider.Facebook:
                    return loginProviderClaims.Single(x => x.Type == ClaimTypes.NameIdentifier).Value;
                default:
                    throw new ArgumentOutOfRangeException(nameof(loginProvider), loginProvider, null);
            }
        }

        private static string GetIssuer(LoginProvider loginProvider)
        {
            switch (loginProvider)
            {
                case LoginProvider.Google:
                    return "Google";
                case LoginProvider.Twitter:
                    return "Twitter";
                case LoginProvider.Facebook:
                    return "Facebook";
                case LoginProvider.Microsoft:
                    return "Microsoft";
                case LoginProvider.LocalJwt:
                    return JwtSecurityTokenBuilder.Issuer;
                default:
                    throw new ArgumentOutOfRangeException(nameof(loginProvider), loginProvider, null);
            }
        }
    }
}
