using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.ViewModels;

namespace HealthSharingPortal.API.Workflow.ViewModelBuilders
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

        public async Task<List<IViewModel<Account>>> BatchBuild(List<Account> models)
        {
            var personIds = models.Select(x => x.PersonId).ToList();
            var persons = await personsStore.SearchAsync(x => personIds.Contains(x.Id));
            var personDictionary = persons.ToDictionary(x => x.Id, x => x);
            var viewModels = new List<IViewModel<Account>>();
            foreach (var account in models)
            {
                var viewModel = new AccountViewModel(account.Username, account.AccountType, personDictionary[account.PersonId]);
                viewModels.Add(viewModel);
            }
            return viewModels;
        }
    }
}
