using System;
using System.Threading.Tasks;
using JanKIS.API.Models;
using JanKIS.API.Storage;

namespace JanKIS.API.AccessManagement
{
    public class AuthenticationModule
    {
        private readonly IEmployeesStore employeesStore;
        private readonly IReadonlyStore<Patient> patientsStore;
        private readonly ISecurityTokenBuilder securityTokenBuilder;

        public AuthenticationModule(
            IEmployeesStore employeesStore, 
            IReadonlyStore<Patient> patientsStore,
            ISecurityTokenBuilder securityTokenBuilder)
        {
            this.employeesStore = employeesStore;
            this.patientsStore = patientsStore;
            this.securityTokenBuilder = securityTokenBuilder;
        }

        public async Task<bool> ChangePasswordAsync(string employeeId, string password, bool changePasswordOnNextLogin = false)
        {
            var matchingEmployee = await employeesStore.GetByIdAsync(employeeId);
            if (matchingEmployee == null)
                return false;
            var saltBytes = Convert.FromBase64String(matchingEmployee.Salt);
            var passwordHash = PasswordHasher.Hash(password, saltBytes, PasswordHasher.RecommendedHashLength);
            var passwordBase64 = Convert.ToBase64String(passwordHash);

            var result = await employeesStore.ChangePasswordAsync(employeeId, passwordBase64, changePasswordOnNextLogin);
            return result.IsSuccess;
        }

        public async Task<AuthenticationResult> AuthenticateEmployeeAsync(string employeeId, string password)
        {
            var existingEmployee = await employeesStore.GetByIdAsync(employeeId);
            if(existingEmployee == null)
                return AuthenticationResult.Failed(AuthenticationErrorType.UserNotFound);
            if(string.IsNullOrEmpty(password))
                return AuthenticationResult.Failed(AuthenticationErrorType.InvalidPassword);
            var salt = Convert.FromBase64String(existingEmployee.Salt);
            var storedPasswordHash = Convert.FromBase64String(existingEmployee.PasswordHash);
            var providedPasswordHash = PasswordHasher.Hash(password, salt, 8 * storedPasswordHash.Length);
            var isMatch = HashComparer.Compare(providedPasswordHash, storedPasswordHash);
            if (!isMatch)
            {
                return AuthenticationResult.Failed(AuthenticationErrorType.InvalidPassword);
            }

            return await BuildSecurityTokenForUser(existingEmployee);
        }

        public async Task<AuthenticationResult> AuthenticatePatientAsync(string patientId, string password)
        {
            var existingPatient = await patientsStore.GetByIdAsync(patientId);
            if(existingPatient == null)
                return AuthenticationResult.Failed(AuthenticationErrorType.UserNotFound);
            if(string.IsNullOrEmpty(password))
                return AuthenticationResult.Failed(AuthenticationErrorType.InvalidPassword);
            var salt = Convert.FromBase64String(existingPatient.Salt);
            var storedPasswordHash = Convert.FromBase64String(existingPatient.PasswordHash);
            var providedPasswordHash = PasswordHasher.Hash(password, salt, 8 * storedPasswordHash.Length);
            var isMatch = HashComparer.Compare(providedPasswordHash, storedPasswordHash);
            if (!isMatch)
            {
                return AuthenticationResult.Failed(AuthenticationErrorType.InvalidPassword);
            }

            return await BuildSecurityTokenForUser(existingPatient);
        }

        public async Task<AuthenticationResult> BuildSecurityTokenForUser(PersonWithLogin person)
        {
            var token = await securityTokenBuilder.BuildForUser(person);
            return AuthenticationResult.Success(person.Id, token);
        }
    }
}
