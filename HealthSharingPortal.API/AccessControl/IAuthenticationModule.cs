using System.Collections.Generic;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.AccessControl;
using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.AccessControl
{
    public interface IAuthenticationModule
    {
        Task<bool> ChangePasswordAsync(string accountId, string password, bool changePasswordOnNextLogin = false);
        bool Authenticate(LocalLogin login, string password);
        AuthenticationResult BuildSecurityTokenForUser(Person person, Account account, Login login);
        AuthenticationResult BuildSecurityTokenForGuest(string emergencyPersonId, IList<AccessPermissions> permissions, string emergencyAccessId);
    }
}