using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.API.AccessControl;
using JanKIS.API.Models;

namespace JanKIS.API.AccessManagement
{
    public interface ISecurityTokenBuilder
    {
        Task<string> BuildForUser(Person person, Account account, Login login);
    }
}