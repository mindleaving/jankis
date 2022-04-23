using System.Threading.Tasks;
using HealthSharingPortal.API.Workflow.MenschId.Models;

namespace HealthSharingPortal.API.Workflow.MenschId
{
    public interface IMenschIdApiClient
    {
        Task<MenschIdChallenge> CreateChallenge(string menschId);
    }
}