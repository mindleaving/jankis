using System.Threading.Tasks;

namespace HealthSharingPortal.API.AccessControl
{
    public interface IMenschIdVerifier
    {
        Task<bool> TryCompleteChallenge(
            string challengeId,
            string challengeSecret);

        Task<bool> IsControllingId(
            string menschId,
            string loginId);
    }
}