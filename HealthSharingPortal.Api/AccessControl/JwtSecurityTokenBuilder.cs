using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using HealthModels;
using HealthModels.AccessControl;
using HealthSharingPortal.API.Models;
using Microsoft.IdentityModel.Tokens;

namespace HealthSharingPortal.API.AccessControl
{
    internal class JwtSecurityTokenBuilder : ISecurityTokenBuilder
    {
        private readonly SymmetricSecurityKey privateKey;
        private readonly TimeSpan expirationTime;

        public JwtSecurityTokenBuilder(
            SymmetricSecurityKey privateKey, 
            TimeSpan expirationTime)
        {
            this.privateKey = privateKey;
            this.expirationTime = expirationTime;
        }

        public const string Issuer = "HealthSharingPortal";
        public const string Audience = "HealthSharingPortal";

        public const string UsernameClaimName = "username";
        public const string AccountIdClaimName = "accountId";
        public const string AccountTypeClaimName = "accounttype";
        public const string PersonIdClaimName = "personId";
        public const string EmergencyPersonIdClaimName = "emergencyPersonId";
        public const string EmergencyPermissionsClaimName = "emergencyPermissions";
        public const string EmergencyAccessIdClaimName = "emergencyAccessId";

        public const char PermissionSeparator = '|';

        public string BuildForUser(
            Person person, 
            Account account,
            Login login)
        {
            var claims = new List<Claim>();
            if (login != null)
            {
                if (login is LocalLogin localLogin)
                {
                    claims.Add(new Claim(UsernameClaimName, localLogin.Username));
                }
            }
            if(account != null)
            {
                claims.Add(new Claim(AccountIdClaimName, account.Id));
                claims.Add(new Claim(AccountTypeClaimName, account.AccountType.ToString()));
                claims.Add(new Claim(PersonIdClaimName, account.PersonId));
            }
            if (person != null)
            {
                claims.Add(new Claim(ClaimTypes.Name, $"{person.FirstName} {person.LastName}"));
            }

            return BuildSerializedToken(claims);
        }

        public string BuildForGuest(
            string emergencyPersonId, 
            IList<AccessPermissions> permissions,
            string emergencyAccessId)
        {
            var claims = new List<Claim>
            {
                new (ClaimTypes.Name, "Guest"),
                new (AccountTypeClaimName, AccountType.EmergencyGuest.ToString()),
                new (EmergencyPersonIdClaimName, emergencyPersonId),
                new (EmergencyPermissionsClaimName, string.Join(PermissionSeparator, permissions.Select(x => x.ToString()))),
                new (EmergencyAccessIdClaimName, emergencyAccessId)
            };

            return BuildSerializedToken(claims);
        }

        private string BuildSerializedToken(
            List<Claim> claims)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Audience = Audience,
                Issuer = Issuer,
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.Add(expirationTime),
                SigningCredentials = new SigningCredentials(privateKey, SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var serializedToken = tokenHandler.WriteToken(token);
            return serializedToken;
        }
    }
}
