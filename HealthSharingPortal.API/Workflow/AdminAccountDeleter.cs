using System.Threading.Tasks;

namespace HealthSharingPortal.API.Workflow;

public class AdminAccountDeleter : IAccountDeleter
{
    public Task<AccountDeleterResult> DeleteAsync(
        string accountId)
    {
        throw new System.NotImplementedException();
    }
}