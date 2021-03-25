using System;
using System.Threading.Tasks;
using JanKIS.API.Models;
using JanKIS.API.Storage;

namespace JanKIS.API.AccessManagement
{
    public class AuthenticationModule<T> where T: PersonWithLogin
    {
        private readonly IPersonWithLoginStore<T> userStore;
        private readonly ISecurityTokenBuilder securityTokenBuilder;

        public AuthenticationModule(
            IPersonWithLoginStore<T> userStore,
            ISecurityTokenBuilder securityTokenBuilder)
        {
            this.userStore = userStore;
            this.securityTokenBuilder = securityTokenBuilder;
        }

        public async Task<bool> ChangePasswordAsync(string userId, string password, bool changePasswordOnNextLogin = false)
        {
            var matchingEmployee = await userStore.GetByIdAsync(userId);
            if (matchingEmployee == null)
                return false;
            var saltBytes = Convert.FromBase64String(matchingEmployee.Salt);
            var passwordHash = PasswordHasher.Hash(password, saltBytes, PasswordHasher.RecommendedHashLength);
            var passwordBase64 = Convert.ToBase64String(passwordHash);

            var result = await userStore.ChangePasswordAsync(userId, passwordBase64, changePasswordOnNextLogin);
            return result.IsSuccess;
        }

        public async Task<AuthenticationResult> AuthenticateAsync(string userId, string password)
        {
            var existingEmployee = await userStore.GetByIdAsync(userId);
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

        public async Task<AuthenticationResult> BuildSecurityTokenForUser(PersonWithLogin person)
        {
            var token = await securityTokenBuilder.BuildForUser(person);
            return AuthenticationResult.Success(person.Id, token);
        }
    }
}
