using System;
using System.Linq;
using JanKIS.API.Models;
using JanKIS.API.ViewModels;

namespace JanKIS.API.Workflow
{
    public class ServiceRequestGatekeeper
    {
        public bool CanAcceptServiceRequest(
            ServiceDefinition service,
            ServiceRequest request,
            LoggedInUserViewModel user)
        {
            if (request.Service.Id != service.Id)
                throw new Exception("Service-ID doesn't match that of the request");
            return service.Audience.Any(audience => RequesterMatchesAudience(user, audience));
        }

        private bool RequesterMatchesAudience(
            LoggedInUserViewModel user,
            ServiceAudience audience)
        {
            if (audience.Type == ServiceAudienceType.All)
            {
                return true;
            }
            if (audience.Type == ServiceAudienceType.Role)
            {
                var roleServiceAudience = (RoleServiceAudience) audience;
                return user.Roles.Any(x => x.Id == roleServiceAudience.RoleId);
            }
            if (audience.Type == ServiceAudienceType.Person)
            {
                var personServiceAudience = (PersonServiceAudience) audience;
                return user.ProfileData.Id == personServiceAudience.PersonId;
            }
            return false;
        }
    }
}
