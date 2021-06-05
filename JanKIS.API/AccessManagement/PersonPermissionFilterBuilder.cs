using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;

namespace JanKIS.API.AccessManagement
{
    public class PersonPermissionFilterBuilder : IPermissionFilterBuilder<Person>
    {
        private readonly IAccountStore accountsStore;
        private readonly MyPatientsLister myPatientsLister;

        public PersonPermissionFilterBuilder(
            IAccountStore accountsStore,
            MyPatientsLister myPatientsLister)
        {
            this.accountsStore = accountsStore;
            this.myPatientsLister = myPatientsLister;
        }

        public async Task<PermissionFilter<Person>> Build(CurrentUser currentUser)
        {
            if(currentUser.AccountType == AccountType.Patient)
            {
                return PermissionFilter<Person>.PartialAuthorization(x => x.Id == currentUser.PersonId, null);
            }

            var permissions = currentUser.Permissions;
            if (permissions.Contains(Permission.ViewAllPersons))
                return PermissionFilter<Person>.FullyAuthorized(TODO);

            var viewPersonPermissions = new[] {Permission.ViewAllEmployees, Permission.ViewAllDepartmentPatients};
            if(!permissions.Intersect(viewPersonPermissions).Any())
                return PermissionFilter<Person>.Unauthorized();

            var filters = new List<Expression<Func<Person,bool>>>();
            if (permissions.Contains(Permission.ViewAllEmployees))
            {
                var employeeAccounts = await accountsStore.SearchAsync(x => x.AccountType == AccountType.Employee, PermissionFilter<Account>.FullyAuthorized(TODO));
                var employeeProfileIds = employeeAccounts.Select(x => x.PersonId).Distinct().ToList();
                filters.Add(x => employeeProfileIds.Contains(x.Id));
            }
            if (permissions.Contains(Permission.ViewAllDepartmentPatients))
            {
                var departmentPatientIds = await myPatientsLister.ListMyPatientIds(currentUser.DepartmentIds);
                filters.Add(x => departmentPatientIds.Contains(x.Id));
            }

            var combinedFilter = SearchExpressionBuilder.And(filters.ToArray());
            return PermissionFilter<Person>.PartialAuthorization(combinedFilter, null);
        }
    }
}
