using System.Threading.Tasks;

namespace HealthSharingPortal.API.Workflow;

public class HealthProfessionalAccountDeleter : IAccountDeleter
{
    public Task<AccountDeleterResult> DeleteAsync(
        string accountId)
    {
        throw new System.NotImplementedException();
    }
}