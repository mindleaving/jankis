using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HealthModels.Services;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Storage;
using JanKIS.API.Models;
using JanKIS.API.Storage;

namespace JanKIS.API.Workflow
{
    public class ServiceRequestChangePolicy
    {
        private readonly IReadonlyStore<Account> accountsStore;
        private readonly IAdmissionsStore admissionsStore;

        public ServiceRequestChangePolicy(
            IReadonlyStore<Account> accountsStore,
            IAdmissionsStore admissionsStore)
        {
            this.accountsStore = accountsStore;
            this.admissionsStore = admissionsStore;
        }

        public async Task<bool> CanChange(
            ServiceRequest request,
            Account account,
            InstitutionPolicy institutionPolicy,
            List<IPersonDataAccessGrant> accessGrants)
        {
            if (request.State != ServiceRequestState.Requested)
                return false;
            if(request.Requester == account.Id)
                return true;
            if (account.AccountType == AccountType.Employee)
            {
                if (!institutionPolicy.UsersFromSameDepartmentCanChangeServiceRequests)
                    return false;
                var requesterDepartmentIds = await GetDepartmentIds(request.Requester, accessGrants);
                var employeeAccount = (EmployeeAccount) account;
                if (employeeAccount.DepartmentIds.Intersect(requesterDepartmentIds).Any())
                    return true;
            }
            return false;
        }

        private async Task<List<string>> GetDepartmentIds(string personId, List<IPersonDataAccessGrant> accessGrants)
        {
            var departmentIds = new List<string>();
            var account = await accountsStore.GetByIdAsync(personId);
            if (account == null)
                return new List<string>();
            if (account.AccountType == AccountType.Patient)
            {
                throw new NotImplementedException();
                var currentAdmission = await admissionsStore.GetCurrentAdmissionAsync(personId, accessGrants);
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
