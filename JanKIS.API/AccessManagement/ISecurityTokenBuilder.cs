using System.Threading.Tasks;
using JanKIS.API.Models;

namespace JanKIS.API.AccessManagement
{
    public interface ISecurityTokenBuilder
    {
        Task<string> BuildForUser(Employee employee);
    }
}