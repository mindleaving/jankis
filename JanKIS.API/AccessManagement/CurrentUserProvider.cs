using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using Microsoft.AspNetCore.Http;

namespace JanKIS.API.AccessManagement
{
    public class CurrentUserProvider
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IReadonlyStore<Account> accountsStore;

        public CurrentUserProvider(
            IHttpContextAccessor httpContextAccessor,
            IReadonlyStore<Account> accountsStore)
        {
            this.httpContextAccessor = httpContextAccessor;
            this.accountsStore = accountsStore;
        }

        public async Task<CurrentUser> Build()
        {
            var claimPrincipal = httpContextAccessor.HttpContext?.User;
            if (claimPrincipal == null)
                return null;
            var username = GetUsername(claimPrincipal);
            var accountType = GetAccountType(claimPrincipal);
            var permissions = GetPermissions(claimPrincipal);
            var account = await accountsStore.GetByIdAsync(username, PermissionFilter<Account>.FullyAuthorized(TODO));
            var personId = account.PersonId;
            List<string> departmentIds;
            if (accountType == AccountType.Employee)
            {
                departmentIds = (account as EmployeeAccount)?.DepartmentIds ?? new List<string>();
            }
            else
            {
                departmentIds = new List<string>();
            }
            return new CurrentUser(
                username,
                accountType,
                permissions,
                personId,
                departmentIds);
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