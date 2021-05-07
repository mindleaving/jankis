using System.Threading.Tasks;
using JanKIS.API.Models;
using JanKIS.API.Storage;

namespace JanKIS.API.AccessManagement
{
    public class AccountPermissionFilterBuilder : IPermissionFilterBuilder<Account>
    {
        private readonly CurrentUser currentUser;
        private readonly IReadonlyStore<Account> accountsStore;

        public AccountPermissionFilterBuilder(
            CurrentUser currentUser,
            IReadonlyStore<Account> accountsStore)
        {
            this.currentUser = currentUser;
            this.accountsStore = accountsStore;
        }

        public async Task<PermissionFilter<Account>> Build()
        {
            if(currentUser == null)
                return PermissionFilter<Account>.FullyAuthorized();
            var account = await accountsStore.GetByIdAsync(currentUser.Username);
            if (account.AccountType == AccountType.Patient)
            {
                return PermissionFilter<Account>.PartialAuthorization(x => x.Username == currentUser.Username, null);
            }

            if (account.AccountType == AccountType.Employee)
            {
                return PermissionFilter<Account>.FullyAuthorized();
            }

            return PermissionFilter<Account>.Unauthorized();
        }
    }
}
