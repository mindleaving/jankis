using System;
using System.Security.Cryptography;

namespace HealthSharingPortal.API.AccessControl
{
    public static class LocalLoginFactory
    {
        public static LocalLogin Create(
            string username,
            string password)
        {
            var salt = CreateSalt();
            var saltBase64 = Convert.ToBase64String(salt);
            var passwordHash = PasswordHasher.Hash(password, salt, PasswordHasher.RecommendedHashLength);
            var passwordHashBase64 = Convert.ToBase64String(passwordHash);
            var login = new LocalLogin
            {
                Id = username,
                Username = username,
                PasswordHash = passwordHashBase64,
                Salt = saltBase64
            };
            return login;
        }

        private static byte[] CreateSalt()
        {
            var salt = RandomNumberGenerator.GetBytes(128 / 8);
            return salt;
        }
    }
}