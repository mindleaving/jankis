using System.Threading.Tasks;
using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.Storage
{
    public interface IAccountStore : IStore<Account>
    {
        Task<StorageResult> ChangePasswordAsync(string username, string passwordBase64, bool changePasswordOnNextLogin);
        Task DeleteAllForPerson(string personId);
    }
}