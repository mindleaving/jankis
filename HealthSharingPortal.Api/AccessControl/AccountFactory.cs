using System;
using System.Security.Cryptography;
using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.AccessControl
{
    public static class AccountFactory
    {
        public static Account Create(
            string personId, 
            string username, 
            AccountType accountType,
            string password)
        {
            var salt = CreateSalt();
            var saltBase64 = Convert.ToBase64String(salt);
            var passwordHash = PasswordHasher.Hash(password, salt, PasswordHasher.RecommendedHashLength);
            var passwordHashBase64 = Convert.ToBase64String(passwordHash);
            return new Account(personId, username, accountType, saltBase64, passwordHashBase64);
        }

        private static byte[] CreateSalt()
        {
            var salt = new byte[128 / 8];
            using var rng = new RNGCryptoServiceProvider();
            rng.GetBytes(salt);
            return salt;
        }
    }
}
