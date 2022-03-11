using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.Api.Models;

namespace HealthSharingPortal.Api.AccessControl
{
    public interface ISecurityTokenBuilder
    {
        Task<string> BuildForUser(Person person, Account account);
    }
}