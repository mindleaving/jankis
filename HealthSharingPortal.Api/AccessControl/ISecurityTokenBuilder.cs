using System.Collections.Generic;
using HealthModels;
using HealthModels.AccessControl;
using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.AccessControl
{
    public interface ISecurityTokenBuilder
    {
        string BuildForUser(Person person, Account account, Login login);
        string BuildForGuest(string emergencyPersonId, IList<AccessPermissions> permissions, string emergencyAccessId);
    }
}