using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using JanKIS.API.Models;
using Microsoft.AspNetCore.Http;

namespace JanKIS.API.AccessManagement
{
    public class UserBuilder
    {
        private readonly IHttpContextAccessor httpContextAccessor;

        public UserBuilder(IHttpContextAccessor httpContextAccessor)
        {
            this.httpContextAccessor = httpContextAccessor;
        }

        public CurrentUser Build()
        {
            var claimPrincipal = httpContextAccessor.HttpContext?.User;
            if (claimPrincipal == null)
                return null;
            var username = GetUsername(claimPrincipal);
            var accountType = GetAccountType(claimPrincipal);
            var permissions = GetPermissions(claimPrincipal);
            return new CurrentUser(
                username,
                accountType,
                permissions);
        }

        private static string GetUsername(ClaimsPrincipal claimPrincipal)
        {
            return claimPrincipal.FindFirst(JwtSecurityTokenBuilder.IdClaimName)?.Value;
        }

        private static AccountType? GetAccountType(ClaimsPrincipal claimPrincipal)
        {
            var accountTypeClaim = claimPrincipal.FindFirst(JwtSecurityTokenBuilder.AccountTypeClaimName);
            if (accountTypeClaim == null)
                return null;
            return Enum.Parse<AccountType>(accountTypeClaim.Value, true);
        }

        private static List<Permission> GetPermissions(ClaimsPrincipal claimPrincipal)
        {
            var permissionsClaim = claimPrincipal.FindFirst(JwtSecurityTokenBuilder.PermissionsClaimName);
            if (permissionsClaim == null)
                return new List<Permission>();
            return permissionsClaim.Value.Split(",").Select(x => Enum.Parse<Permission>(x, true)).ToList();
        }
    }
}