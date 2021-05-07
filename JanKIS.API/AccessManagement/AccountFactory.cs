using System;
using System.Security.Cryptography;
using JanKIS.API.Models;

namespace JanKIS.API.AccessManagement
{
    public static class AccountFactory
    {
        public static EmployeeAccount CreateEmployeeAccount(
            string personId,
            string username,
            string password)
        {
            var salt = CreateSalt();
            var saltBase64 = Convert.ToBase64String(salt);
            var passwordHash = PasswordHasher.Hash(password, salt, PasswordHasher.RecommendedHashLength);
            var passwordHashBase64 = Convert.ToBase64String(passwordHash);
            return new EmployeeAccount(personId, username, DateTime.UtcNow, saltBase64, passwordHashBase64);
        }

        public static PatientAccount CreatePatientAccount(
            string personId,
            string username,
            string password)
        {
            var salt = CreateSalt();
            var saltBase64 = Convert.ToBase64String(salt);
            var passwordHash = PasswordHasher.Hash(password, salt, PasswordHasher.RecommendedHashLength);
            var passwordHashBase64 = Convert.ToBase64String(passwordHash);
            return new PatientAccount(personId, username, DateTime.UtcNow, saltBase64, passwordHashBase64);
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
