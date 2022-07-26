using System.Threading.Tasks;

namespace HealthSharingPortal.API.Workflow;

public interface IAccountDeleter
{
    Task<AccountDeleterResult> DeleteAsync(
        string accountId);
}

public class AccountDeleterResult
{
    public bool IsSuccess { get; set; }
    public string ErrorMessage { get; set; }
}