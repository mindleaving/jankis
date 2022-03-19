using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using HealthModels;
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

        public const string UsernameClaimName = "username";
        public const string AccountTypeClaimName = "accounttype";
        public const string PersonIdClaimName = "personId";

        public Task<string> BuildForUser(Person person, Account account)
        {
            var claims = new List<Claim>
            {
                new ("id", account.Id),
                new (UsernameClaimName, account.Username),
                new (ClaimTypes.Name, $"{person.FirstName} {person.LastName}"),
                new (AccountTypeClaimName, account.AccountType.ToString()),
                new (PersonIdClaimName, account.PersonId)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Audience = "HealthSharingPortal",
                Issuer = "HealthSharingPortal",
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.Add(expirationTime),
                SigningCredentials = new SigningCredentials(privateKey, SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var serializedToken = tokenHandler.WriteToken(token);

            return Task.FromResult(serializedToken);
        }
    }
}
