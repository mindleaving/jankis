using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JanKIS.API.Extensions;
using JanKIS.API.Models;
using JanKIS.API.Storage;

namespace JanKIS.API.Workflow
{
    public class ServiceRequestChangePolicy
    {
        private readonly IReadonlyStore<ServiceDefinition> servicesStore;
        private readonly IReadonlyStore<Patient> patientsStore;
        private readonly IReadonlyStore<Employee> employeesStore;

        public ServiceRequestChangePolicy(
            IReadonlyStore<ServiceDefinition> servicesStore,
            IReadonlyStore<Patient> patientsStore,
            IReadonlyStore<Employee> employeesStore)
        {
            this.servicesStore = servicesStore;
            this.patientsStore = patientsStore;
            this.employeesStore = employeesStore;
        }

        public async Task<bool> CanChange(
            ServiceRequest request,
            PersonWithLogin user,
            InstitutionPolicy institutionPolicy)
        {
            if (request.State != ServiceRequestState.Requested)
                return false;
            if(request.Requester == user.ToPersonReference())
                return true;
            if (request.Requester.Type == PersonType.Employee && !institutionPolicy.UsersFromSameDepartmentCanChangeServiceRequests)
                return false;
            if (user is Employee employee)
            {
                var requesterDepartmentIds = await GetDepartmentIds(request.Requester);
                if (employee.DepartmentIds.Intersect(requesterDepartmentIds).Any())
                    return true;
            }
            return false;
        }

        private async Task<List<string>> GetDepartmentIds(PersonReference personReference)
        {
            var departmentIds = new List<string>();
            if (personReference.Type == PersonType.Patient)
            {
                var patient = await patientsStore.GetByIdAsync(personReference.Id);
                if (patient == null)
                    throw new Exception($"Patient with ID '{personReference.Id}' doesn't exist");
                foreach (var contactPerson in patient.ContactPersons)
                {
                    if(contactPerson.Type != PersonType.Employee)
                        continue;
                    var employee = await employeesStore.GetByIdAsync(contactPerson.Id);
                    if(employee == null)
                        continue;
                    departmentIds.AddRange(employee.DepartmentIds);
                }
                return departmentIds.Distinct().ToList();
            }

            if (personReference.Type == PersonType.Employee)
            {
                var employee = await employeesStore.GetByIdAsync(personReference.Id);
                if(employee == null)
                    throw new Exception($"Employee with ID '{personReference.Id}' doesn't exist");
                return employee.DepartmentIds;
            }

            throw new ArgumentOutOfRangeException(
                nameof(personReference.Type),
                $"Getting department ID for person of type '{personReference.Type}' is not implemented");
        }
    }
}
