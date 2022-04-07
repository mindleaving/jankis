using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.ViewModels;

namespace HealthSharingPortal.API.Workflow.ViewModelBuilders
{
    public class AccountViewModelBuilderOptions : IViewModelBuilderOptions<Account>
    {
        public List<IPersonDataAccessGrant> AccessGrants { get; set; }
    }
    public class AccountViewModelBuilder : IViewModelBuilder<Account>
    {
        private readonly IPersonDataReadonlyStore<Person> personsStore;

        public AccountViewModelBuilder(
            IPersonDataReadonlyStore<Person> personsStore)
        {
            this.personsStore = personsStore;
        }

        public async Task<IViewModel<Account>> Build(
            Account account,
            IViewModelBuilderOptions<Account> options = null)
        {
            if(options is not AccountViewModelBuilderOptions accountViewModelBuilderOptions)
                throw new ArgumentException($"{nameof(AccountViewModelBuilder)} was called without options, but they are mandatory and must contain access grants");
            var person = await personsStore.GetByIdAsync(account.PersonId, accountViewModelBuilderOptions.AccessGrants);
            return new AccountViewModel(account.Username, account.AccountType, person);
        }

        public async Task<List<IViewModel<Account>>> BatchBuild(
            List<Account> models,
            IViewModelBuilderOptions<Account> options = null)
        {
            if(options is not AccountViewModelBuilderOptions accountViewModelBuilderOptions)
                throw new ArgumentException($"{nameof(AccountViewModelBuilder)} was called without options, but they are mandatory and must contain access grants");
            var personIds = models.Select(x => x.PersonId).ToList();
            var persons = personIds.Count > 0
                ? await personsStore.SearchAsync(x => personIds.Contains(x.Id), accountViewModelBuilderOptions.AccessGrants)
                : new List<Person>();
            var personDictionary = persons.ToDictionary(x => x.Id);
            var viewModels = new List<IViewModel<Account>>();
            foreach (var account in models)
            {
                if(!personDictionary.ContainsKey(account.PersonId))
                    continue;
                var viewModel = new AccountViewModel(account.Username, account.AccountType, personDictionary[account.PersonId]);
                viewModels.Add(viewModel);
            }
            return viewModels;
        }
    }
}
