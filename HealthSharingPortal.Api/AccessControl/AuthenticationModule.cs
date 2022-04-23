using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.AccessControl;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;

namespace HealthSharingPortal.API.AccessControl
{
    public class AuthenticationModule : IAuthenticationModule
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

        public bool Authenticate(LocalLogin login, string password)
        {
            if (string.IsNullOrEmpty(password))
                return false;
            var salt = Convert.FromBase64String(login.Salt);
            var storedPasswordHash = Convert.FromBase64String(login.PasswordHash);
            var providedPasswordHash = PasswordHasher.Hash(password, salt, 8 * storedPasswordHash.Length);
            return HashComparer.Compare(providedPasswordHash, storedPasswordHash);
        }

        public AuthenticationResult BuildSecurityTokenForUser(Person person, Account account, Login login)
        {
            var token = securityTokenBuilder.BuildForUser(person, account, login);
            var isPasswordChangeRequired = (login as LocalLogin)?.IsPasswordChangeRequired ?? false;
            return AuthenticationResult.Success(token, isPasswordChangeRequired);
        }

        public AuthenticationResult BuildSecurityTokenForGuest(
            string emergencyPersonId,
            IList<AccessPermissions> permissions,
            string emergencyAccessId)
        {
            var token = securityTokenBuilder.BuildForGuest(emergencyPersonId, permissions, emergencyAccessId);
            return AuthenticationResult.Success(token, false);
        }
    }
}
