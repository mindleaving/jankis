using System.Collections.Generic;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.AccessControl;
using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.AccessControl
{
    public interface IAuthenticationModule
    {
        Task<bool> ChangePasswordAsync(string userId, string password, bool changePasswordOnNextLogin = false);
        Task<AuthenticationResult> AuthenticateAsync(Person person, Account account, string password);
        Task<AuthenticationResult> BuildSecurityTokenForUser(Person person, Account account);
        Task<AuthenticationResult> BuildSecurityTokenForGuest(string emergencyPersonId, IList<AccessPermissions> permissions, string emergencyAccessId);
    }
}