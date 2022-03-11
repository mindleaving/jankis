using System.Collections.Generic;
using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.Api.Models;
using HealthSharingPortal.Api.Storage;
using HealthSharingPortal.Api.ViewModels;

namespace HealthSharingPortal.Api.Workflow.ViewModelBuilders
{
    public class AccountViewModelBuilder : IViewModelBuilder<Account>
    {
        private readonly IReadonlyStore<Person> personsStore;

        public AccountViewModelBuilder(
            IReadonlyStore<Person> personsStore)
        {
            this.personsStore = personsStore;
        }

        public async Task<IViewModel<Account>> Build(Account account)
        {
            var person = await personsStore.GetByIdAsync(account.PersonId);
            return new AccountViewModel(account.Username, account.AccountType, person);
        }
    }
}
