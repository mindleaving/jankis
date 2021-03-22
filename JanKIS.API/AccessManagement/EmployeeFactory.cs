using System;
using System.Security.Cryptography;
using JanKIS.API.Models;

namespace JanKIS.API.AccessManagement
{
    public static class EmployeeFactory
    {
        public static Employee Create(
            string id,
            string firstName,
            string lastName,
            DateTime birthday,
            string institutionId,
            string password)
        {
            var salt = CreateSalt();
            var saltBase64 = Convert.ToBase64String(salt);
            var passwordHash = PasswordHasher.Hash(password, salt, PasswordHasher.RecommendedHashLength);
            var passwordHashBase64 = Convert.ToBase64String(passwordHash);
            return new Employee(id, firstName, lastName, birthday, institutionId)
            {
                Salt = saltBase64,
                PasswordHash = passwordHashBase64,
                IsPasswordChangeRequired = true
            };
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
