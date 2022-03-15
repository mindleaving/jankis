using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.AccessControl
{
    public interface ISecurityTokenBuilder
    {
        Task<string> BuildForUser(Person person, Account account);
    }
}