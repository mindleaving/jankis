using System;
using System.Linq;
using JanKIS.API.Models;

namespace JanKIS.API.Workflow
{
    public class ServiceRequestGatekeeper
    {
        public bool CanAcceptServiceRequest(
            ServiceDefinition service,
            ServiceRequest request,
            Person person)
        {
            if (request.ServiceId != service.Id)
                throw new Exception("Service-ID doesn't match that of the request");
            return service.Audience.Any(audience => RequesterMatchesAudience(person, audience));
        }

        private bool RequesterMatchesAudience(
            Person person,
            ServiceAudience audience)
        {
            if (audience.Type == ServiceAudienceType.All)
            {
                return true;
            }
            if (audience.Type == ServiceAudienceType.Role)
            {
                if (!(person is Employee employee))
                    return false;
                var roleServiceAudience = (RoleServiceAudience) audience;
                return employee.Roles.Contains(roleServiceAudience.RoleName);
            }
            if (audience.Type == ServiceAudienceType.Employee)
            {
                if (!(person is Employee employee))
                    return false;
                var employeeServiceAudience = (EmployeeServiceAudience) audience;
                return employee.Id == employeeServiceAudience.EmployeeId;
            }
            if (audience.Type == ServiceAudienceType.Patient)
            {
                if (!(person is Patient patient))
                    return false;
                var patientServiceAudience = (PatientServiceAudience) audience;
                return patient.Id == patientServiceAudience.PatientId;
            }
            return false;
        }
    }
}
