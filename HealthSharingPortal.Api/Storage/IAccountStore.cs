using System.Collections.Generic;
using System.Threading.Tasks;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.Storage
{
    public interface IAccountStore : IStore<Account>
    {
        Task DeleteAllForPerson(string personId);
        Task<List<Account>> GetForLoginAsync(Login login);
    }
}