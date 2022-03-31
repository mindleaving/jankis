using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.API.Storage;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using Microsoft.IdentityModel.Tokens;

namespace JanKIS.API.AccessManagement
{
    internal class JwtSecurityTokenBuilder : ISecurityTokenBuilder
    {
        private readonly IReadonlyStore<Role> rolesStore;
        private readonly SymmetricSecurityKey privateKey;
        private readonly TimeSpan expirationTime;

        public JwtSecurityTokenBuilder(
            IReadonlyStore<Role> rolesStore,
            SymmetricSecurityKey privateKey, 
            TimeSpan expirationTime)
        {
            this.rolesStore = rolesStore;
            this.privateKey = privateKey;
            this.expirationTime = expirationTime;
        }

        public const string UsernameClaimName = "username";
        public const string AccountTypeClaimName = "accounttype";
        public const string PersonIdClaimName = "personId";

        public async Task<string> BuildForUser(Person person, Account account)
        {
            var claims = new List<Claim>
            {
                new ("id", account.Id),
                new (UsernameClaimName, account.Username),
                new (ClaimTypes.Name, $"{person.FirstName} {person.LastName}"),
                new (AccountTypeClaimName, account.AccountType.ToString()),
                new (PersonIdClaimName, account.PersonId)
            };
            if (account.AccountType == AccountType.Employee)
            {
                var employeeAccount = (EmployeeAccount) account;
                var roleClaim = new Claim("roles", string.Join(",", employeeAccount.Roles));
                claims.Add(roleClaim);
                var permissionClaims = await GetPermissionClaims(employeeAccount);
                claims.AddRange(permissionClaims);
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Audience = "JanKIS",
                Issuer = "JanKIS",
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.Add(expirationTime),
                SigningCredentials = new SigningCredentials(privateKey, SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var serializedToken = tokenHandler.WriteToken(token);

            return serializedToken;
        }

        private async Task<IEnumerable<Claim>> GetPermissionClaims(EmployeeAccount account)
        {
            if (account.IsPasswordChangeRequired)
            {
                // If password change is required, don't make any other claims than the user ID and name
                return new List<Claim>();
            }

            var permissionsAggregator = new PermissionsAggregator(rolesStore);
            var permissions = await permissionsAggregator.Aggregate(
                account.Roles,
                account.PermissionModifiers);
            return permissions.Select(permission => new Claim(permission.ToString(), "true")).ToList();
        }

        
    }
}
