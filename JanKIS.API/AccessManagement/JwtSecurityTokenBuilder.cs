using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
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

        public async Task<string> BuildForUser(PersonWithLogin person)
        {
            var permissionClaims = await GetPermissionClaims(person);
            var personTypeClaim = new Claim("personType", person.Type.ToString());
            var roleClaim = new Claim("roles", string.Join(",",person.Roles));

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Audience = "JanKIS",
                Issuer = "JanKIS",
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("id", person.Id),
                    new Claim(ClaimTypes.Name, $"{person.FirstName} {person.LastName}"),
                    personTypeClaim,
                    roleClaim
                }.Concat(permissionClaims)),
                Expires = DateTime.UtcNow.Add(expirationTime),
                SigningCredentials = new SigningCredentials(privateKey, SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var serializedToken = tokenHandler.WriteToken(token);

            return serializedToken;
        }

        private async Task<IEnumerable<Claim>> GetPermissionClaims(PersonWithLogin person)
        {
            if (person.IsPasswordChangeRequired)
            {
                // If password change is required, don't make any other claims than the user ID and name
                return new List<Claim>();
            }

            var roles = await rolesStore.GetAllAsync();
            var permissions = AggregatePermissions(
                person.Roles,
                roles,
                person.PermissionModifiers);
            return permissions.Select(permission => new Claim(permission.ToString(), "true")).ToList();
        }

        private List<Permission> AggregatePermissions(
            List<string> employeeRoles,
            List<Role> roles,
            List<PermissionModifier> employeePermissionModifiers)
        {
            var explicitlyGranted = employeePermissionModifiers.Where(x => x.Type == PermissionModifierType.Grant).Select(x => x.Permission);
            var explicitlyDenied = employeePermissionModifiers.Where(x => x.Type == PermissionModifierType.Deny).Select(x => x.Permission);
            return roles
                .Where(role => employeeRoles.Contains(role.Id))
                .SelectMany(role => role.Permissions)
                .Concat(explicitlyGranted)
                .Distinct()
                .Except(explicitlyDenied) // Order is important. If permission is both granted AND denied (shouldn't happen, but if it does) it is denied
                .ToList();
        }
    }
}
