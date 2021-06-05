using System.Threading.Tasks;
using JanKIS.API.Models;

namespace JanKIS.API.AccessManagement
{
    public class AccountPermissionFilterBuilder : IPermissionFilterBuilder<Account>
    {
        public async Task<PermissionFilter<Account>> Build(CurrentUser currentUser, DataAccessType accessType)
        {
            if (currentUser.AccountType == AccountType.Patient)
            {
                return PermissionFilter<Account>.PartialAuthorization(accessType, x => x.Username == currentUser.Username, null);
            }

            if (currentUser.AccountType == AccountType.Employee)
            {
                return PermissionFilter<Account>.FullyAuthorized(accessType);
            }

            return PermissionFilter<Account>.Unauthorized(accessType);
        }
    }
}
