using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.Storage
{
    public interface ILoginStore : IStore<Login>
    {
        Task<StorageResult> ChangePasswordAsync(
            string username,
            string passwordBase64,
            bool changePasswordOnNextLogin);

        Task<ExternalLogin> GetExternalByIdAsync(LoginProvider loginProvider, string externalId);
        Task<LocalLogin> GetLocalByUsername(string username);
        Task<Login> GetFromClaimsAsync(List<Claim> claims);
    }
}