using System.Collections.Generic;
using System.Threading.Tasks;
using HealthModels;
using JanKIS.API.Models;
using JanKIS.API.Storage;

namespace JanKIS.API.ViewModels.Builders
{
    public class AccountViewModelBuilder : IViewModelBuilder<Account>
    {
        private readonly ICachedReadonlyStore<Role> rolesStore;
        private readonly ICachedReadonlyStore<Department> departmentsStore;
        private readonly IReadonlyStore<Person> personsStore;

        public AccountViewModelBuilder(
            ICachedReadonlyStore<Role> rolesStore,
            ICachedReadonlyStore<Department> departmentsStore,
            IReadonlyStore<Person> personsStore)
        {
            this.rolesStore = rolesStore;
            this.departmentsStore = departmentsStore;
            this.personsStore = personsStore;
        }

        public async Task<IViewModel<Account>> Build(Account account)
        {
            var person = await personsStore.GetByIdAsync(account.PersonId);
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
                    account.Username,
                    account.AccountType,
                    person,
                    accountRoles,
                    employeeAccount.PermissionModifiers,
                    accountDepartments);
            }
            return new AccountViewModel(account.Username, account.AccountType, person);
        }
    }
}
