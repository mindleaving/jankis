using System.Collections.Generic;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.AccessControl;
using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.AccessControl
{
    public interface ISecurityTokenBuilder
    {
        Task<string> BuildForUser(Person person, Account account);
        Task<string> BuildForGuest(string emergencyPersonId, IList<AccessPermissions> permissions, string emergencyAccessId);
    }
}