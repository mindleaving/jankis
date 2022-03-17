using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Services;
using JanKIS.API.Models;
using JanKIS.API.Storage;

namespace JanKIS.API.Workflow
{
    public class ServiceRequestChangePolicy
    {
        private readonly IReadonlyStore<ServiceDefinition> servicesStore;
        private readonly IReadonlyStore<Person> personsStore;
        private readonly IReadonlyStore<Account> accountsStore;
        private readonly IAdmissionsStore admissionsStore;

        public ServiceRequestChangePolicy(
            IReadonlyStore<ServiceDefinition> servicesStore,
            IReadonlyStore<Person> personsStore,
            IReadonlyStore<Account> accountsStore,
            IAdmissionsStore admissionsStore)
        {
            this.servicesStore = servicesStore;
            this.personsStore = personsStore;
            this.accountsStore = accountsStore;
            this.admissionsStore = admissionsStore;
        }

        public async Task<bool> CanChange(
            ServiceRequest request,
            Account account,
            InstitutionPolicy institutionPolicy)
        {
            if (request.State != ServiceRequestState.Requested)
                return false;
            if(request.Requester == account.Id)
                return true;
            if (account.AccountType == AccountType.Employee)
            {
                if (!institutionPolicy.UsersFromSameDepartmentCanChangeServiceRequests)
                    return false;
                var requesterDepartmentIds = await GetDepartmentIds(request.Requester);
                var employeeAccount = (EmployeeAccount) account;
                if (employeeAccount.DepartmentIds.Intersect(requesterDepartmentIds).Any())
                    return true;
            }
            return false;
        }

        private async Task<List<string>> GetDepartmentIds(string personId)
        {
            var departmentIds = new List<string>();
            var account = await accountsStore.GetByIdAsync(personId);
            if (account == null)
                return new List<string>();
            if (account.AccountType == AccountType.Patient)
            {
                throw new NotImplementedException();
                var currentAdmission = await admissionsStore.GetCurrentAdmissionAsync(personId);
                if (currentAdmission != null)
                {
                    //departmentIds.AddRange(currentAdmission.BedOccupancies.Select(bedOccupancy => bedOccupancy.DepartmentId));
                }
                return departmentIds.Distinct().ToList();
            }

            if (account.AccountType == AccountType.Employee)
            {
                var employeeAccount = (EmployeeAccount) account;
                return employeeAccount.DepartmentIds;
            }

            throw new ArgumentOutOfRangeException(
                nameof(account.AccountType),
                $"Getting department IDs for person with account of type '{account.AccountType}' is not implemented");
        }
    }
}
