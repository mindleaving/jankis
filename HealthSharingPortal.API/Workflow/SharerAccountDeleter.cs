using System.Threading.Tasks;

namespace HealthSharingPortal.API.Workflow;

public class SharerAccountDeleter : IAccountDeleter
{
    public SharerAccountDeleter()
    {

    }

    public Task<AccountDeleterResult> DeleteAsync(
        string accountId)
    {
        throw new System.NotImplementedException();
    }
}