using System.Threading.Tasks;
using HealthModels.AccessControl;

namespace HealthSharingPortal.API.Storage
{
    public interface IHealthProfessionalAccessReadonlyStore : IReadonlyStore<HealthProfessionalAccess>
    {
        Task<bool> HasActiveAccessForPersonAssignedToUser(string personId, string healthProfessionalUsername);
    }
}
