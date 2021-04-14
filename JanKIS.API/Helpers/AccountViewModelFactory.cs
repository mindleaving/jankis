using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using JanKIS.API.ViewModels;

namespace JanKIS.API.Helpers
{
    public class AccountViewModelFactory
    {
        private readonly IDictionary<string, Role> roles;
        private readonly IDictionary<string, Department> departments;
        private readonly IReadonlyStore<Person> personsStore;

        public AccountViewModelFactory(
            IDictionary<string, Role> roles,
            IDictionary<string, Department> departments,
            IReadonlyStore<Person> personsStore)
        {
            this.roles = roles;
            this.departments = departments;
            this.personsStore = personsStore;
        }

        public async Task<AccountViewModel> Create(Account account)
        {
            var person = await personsStore.GetByIdAsync(account.PersonId);
            if (account.AccountType == AccountType.Employee)
            {
                var employeeAccount = (EmployeeAccount) account;
                var accountRoles = employeeAccount.Roles.Select(roleId => roles[roleId]).ToList();
                var accountDepartments = employeeAccount.DepartmentIds.Select(departmentId => departments[departmentId]).ToList();
                return new AccountViewModel(
                    account.Username,
                    account.AccountType,
                    person,
                    accountRoles,
                    employeeAccount.PermissionModifiers,
                    accountDepartments);
            }
            else
            {
                return new AccountViewModel(account.Username, account.AccountType, person);
            }
        }
    }
}
