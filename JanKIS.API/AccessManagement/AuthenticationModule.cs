using System;
using System.Linq;
using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using Account = JanKIS.API.Models.Account;

namespace JanKIS.API.AccessManagement
{
    public class AuthenticationModule
    {
        private readonly ILoginStore loginStore;
        private readonly ISecurityTokenBuilder securityTokenBuilder;

        public AuthenticationModule(
            ISecurityTokenBuilder securityTokenBuilder,
            ILoginStore loginStore)
        {
            this.securityTokenBuilder = securityTokenBuilder;
            this.loginStore = loginStore;
        }

        public async Task<bool> ChangePasswordAsync(
            string username, 
            string password,
            bool changePasswordOnNextLogin = false)
        {
            var login = await loginStore.GetByIdAsync(username);
            if (login == null || login is not LocalLogin localLogin)
                return false;
            var saltBytes = Convert.FromBase64String(localLogin.Salt);
            var passwordHash = PasswordHasher.Hash(password, saltBytes, PasswordHasher.RecommendedHashLength);
            var passwordBase64 = Convert.ToBase64String(passwordHash);

            var result = await loginStore.ChangePasswordAsync(username, passwordBase64, changePasswordOnNextLogin);
            return result.IsSuccess;
        }

        public async Task<AuthenticationResult> AuthenticateAsync(Person person, Account account, string password)
        {
            if(string.IsNullOrEmpty(password))
                return AuthenticationResult.Failed(AuthenticationErrorType.InvalidPassword);
            var logins = await loginStore.SearchAsync(x => account.LoginIds.Contains(x.Id));
            var localLogins = logins.OfType<LocalLogin>().ToList();
            if(!localLogins.Any())
                return AuthenticationResult.Failed(AuthenticationErrorType.AuthenticationMethodNotAvailable);
            foreach (var localLogin in localLogins)
            {
                var salt = Convert.FromBase64String(localLogin.Salt);
                var storedPasswordHash = Convert.FromBase64String(localLogin.PasswordHash);
                var providedPasswordHash = PasswordHasher.Hash(password, salt, 8 * storedPasswordHash.Length);
                var isMatch = HashComparer.Compare(providedPasswordHash, storedPasswordHash);
                if (isMatch)
                {
                    var authenticationResult = await BuildSecurityTokenForUser(person, account, localLogin);
                    return authenticationResult;
                }
            }
            return AuthenticationResult.Failed(AuthenticationErrorType.InvalidPassword);
        }

        public async Task<AuthenticationResult> BuildSecurityTokenForUser(Person person, Account account, Login login)
        {
            var token = await securityTokenBuilder.BuildForUser(person, account, login);
            var isPasswordChangeRequired = (login as LocalLogin)?.IsPasswordChangeRequired ?? false;
            return AuthenticationResult.Success(token, isPasswordChangeRequired);
        }
    }
}
