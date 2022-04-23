using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.ViewModels;
using HealthSharingPortal.API.Workflow.ViewModelBuilders;
using JanKIS.API.Models;
using AccountViewModel = JanKIS.API.ViewModels.AccountViewModel;

namespace JanKIS.API.Workflow.ViewModelBuilders
{
    public class AccountViewModelBuilderOptions : IViewModelBuilderOptions<Account>
    {
        public List<IPersonDataAccessGrant> AccessGrants { get; set; }
    }

    public class AccountViewModelBuilder : IViewModelBuilder<Account>
    {
        private readonly ICachedReadonlyStore<Role> rolesStore;
        private readonly ICachedReadonlyStore<Department> departmentsStore;
        private readonly IPersonDataReadonlyStore<Person> personsStore;

        public AccountViewModelBuilder(
            ICachedReadonlyStore<Role> rolesStore,
            ICachedReadonlyStore<Department> departmentsStore,
            IPersonDataReadonlyStore<Person> personsStore)
        {
            this.rolesStore = rolesStore;
            this.departmentsStore = departmentsStore;
            this.personsStore = personsStore;
        }

        public async Task<IViewModel<Account>> Build(
            Account account,
            IViewModelBuilderOptions<Account> options = null)
        {
            if(options == null || options is not AccountViewModelBuilderOptions accountViewModelBuilderOptions)
                throw new ArgumentException($"{nameof(AccountViewModelBuilder)} was called without options, but they are mandatory and must contain access grants");
            var person = await personsStore.GetByIdAsync(account.PersonId, accountViewModelBuilderOptions.AccessGrants);
            if (account.AccountType == AccountType.Employee)
            {
                var employeeAccount = (EmployeeAccount) account;
                var accountRoles = new List<Role>();
                foreach (var roleId in employeeAccount.Roles)
                {
                    var role = await rolesStore.CachedGetByIdAsync(roleId);
                    accountRoles.Add(role);
                }

                var accountDepartments = new List<Department>();
                foreach (var departmentId in employeeAccount.DepartmentIds)
                {
                    var department = await departmentsStore.CachedGetByIdAsync(departmentId);
                    accountDepartments.Add(department);
                }
                return new AccountViewModel(
                    account.Id,
                    account.AccountType,
                    person,
                    accountRoles,
                    employeeAccount.PermissionModifiers,
                    accountDepartments);
            }
            return new AccountViewModel(account.Id, account.AccountType, person);
        }

        public Task<List<IViewModel<Account>>> BatchBuild(
            List<Account> models,
            IViewModelBuilderOptions<Account> options = null)
        {
            throw new System.NotImplementedException();
        }
    }
}
