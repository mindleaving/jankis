using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JanKIS.API.Models;
using JanKIS.API.Storage;

namespace JanKIS.API.AccessManagement
{
    public class MyPatientsListerOptions
    {
        public Func<PatientServiceParameterResponse, bool> ServiceRequestPatientFilter { get; set; }
    }
    public class MyPatientsLister
    {
        private readonly IReadonlyStore<BedOccupancy> bedOccupanciesStore;
        private readonly IReadonlyStore<ServiceRequest> serviceRequestsStore;

        public MyPatientsLister(IReadonlyStore<BedOccupancy> bedOccupanciesStore,
            IReadonlyStore<ServiceRequest> serviceRequestsStore)
        {
            this.bedOccupanciesStore = bedOccupanciesStore;
            this.serviceRequestsStore = serviceRequestsStore;
        }

        public async Task<List<string>> ListMyPatientIds(EmployeeAccount account, MyPatientsListerOptions options = null)
        {
            var departmentIds = account.DepartmentIds;
            var departmentBedOccupancies = await bedOccupanciesStore.SearchAsync(x => departmentIds.Contains(x.Department.Id));
            var departmentPatientIds = departmentBedOccupancies
                .Select(x => x.Patient?.Id)
                .Where(patientId => patientId != null)
                .ToList();
            var openServiceRequestStates = new List<ServiceRequestState>
            {
                ServiceRequestState.Accepted,
                ServiceRequestState.InProgress,
                ServiceRequestState.ReadyWhenYouAre
            };
            IEnumerable<ServiceRequest> openDepartmentServiceRequests = await serviceRequestsStore.SearchAsync(
                x => departmentIds.Contains(x.Service.DepartmentId) && openServiceRequestStates.Contains(x.State));
            var serviceRequestPatients = openDepartmentServiceRequests
                .SelectMany(request => request.ParameterResponses.Values.Where(response => response.ValueType == ServiceParameterValueType.Patient))
                .Cast<PatientServiceParameterResponse>();
            if (options?.ServiceRequestPatientFilter != null)
                serviceRequestPatients = serviceRequestPatients.Where(options.ServiceRequestPatientFilter);
            var serviceRequestPatientIds = serviceRequestPatients
                .Select(x => x.Patient.Id)
                .ToList();
            return departmentPatientIds
                .Concat(serviceRequestPatientIds)
                .Distinct()
                .ToList();
        }
    }
}
