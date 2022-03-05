using System.Threading.Tasks;
using HealthModels;
using JanKIS.API.Models;

namespace JanKIS.API.AccessManagement
{
    public interface ISecurityTokenBuilder
    {
        Task<string> BuildForUser(Person person, Account account);
    }
}