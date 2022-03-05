using System;
using System.Threading.Tasks;
using HealthModels;
using JanKIS.API.Models;
using JanKIS.API.Storage;

namespace JanKIS.API.AccessManagement
{
    public class AuthenticationModule
    {
        private readonly IReadonlyStore<Person> personStore;
        private readonly IAccountStore accountStore;
        private readonly ISecurityTokenBuilder securityTokenBuilder;

        public AuthenticationModule(
            IReadonlyStore<Person> personStore,
            IAccountStore accountStore,
            ISecurityTokenBuilder securityTokenBuilder)
        {
            this.personStore = personStore;
            this.accountStore = accountStore;
            this.securityTokenBuilder = securityTokenBuilder;
        }

        public async Task<bool> ChangePasswordAsync(string userId, string password, bool changePasswordOnNextLogin = false)
        {
            var matchingAccount = await accountStore.GetByIdAsync(userId);
            if (matchingAccount == null)
                return false;
            var saltBytes = Convert.FromBase64String(matchingAccount.Salt);
            var passwordHash = PasswordHasher.Hash(password, saltBytes, PasswordHasher.RecommendedHashLength);
            var passwordBase64 = Convert.ToBase64String(passwordHash);

            var result = await accountStore.ChangePasswordAsync(userId, passwordBase64, changePasswordOnNextLogin);
            return result.IsSuccess;
        }

        public async Task<AuthenticationResult> AuthenticateAsync(Person person, Account account, string password)
        {
            if(string.IsNullOrEmpty(password))
                return AuthenticationResult.Failed(AuthenticationErrorType.InvalidPassword);
            var salt = Convert.FromBase64String(account.Salt);
            var storedPasswordHash = Convert.FromBase64String(account.PasswordHash);
            var providedPasswordHash = PasswordHasher.Hash(password, salt, 8 * storedPasswordHash.Length);
            var isMatch = HashComparer.Compare(providedPasswordHash, storedPasswordHash);
            if (!isMatch)
            {
                return AuthenticationResult.Failed(AuthenticationErrorType.InvalidPassword);
            }

            return await BuildSecurityTokenForUser(person, account);
        }

        public async Task<AuthenticationResult> BuildSecurityTokenForUser(Person person, Account account)
        {
            var token = await securityTokenBuilder.BuildForUser(person, account);
            return AuthenticationResult.Success(token);
        }
    }
}
