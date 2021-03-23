using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using JanKIS.API.Models;

namespace JanKIS.API.AccessManagement
{
    public static class PersonFactory
    {
        public static Employee CreateEmployee(
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
            return new Employee(id, firstName, lastName, birthday, institutionId, saltBase64, passwordHashBase64);
        }

        public static Patient CreatePatient(
            string id,
            string firstName,
            string lastName,
            DateTime birthday,
            string password,
            HealthInsurance healthInsurance)
        {
            var salt = CreateSalt();
            var saltBase64 = Convert.ToBase64String(salt);
            var passwordHash = PasswordHasher.Hash(password, salt, PasswordHasher.RecommendedHashLength);
            var passwordHashBase64 = Convert.ToBase64String(passwordHash);
            return new Patient(id, firstName, lastName, birthday, healthInsurance, saltBase64, passwordHashBase64)
            {
                Roles = new List<string> { SystemRoles.Patient.Name }
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
