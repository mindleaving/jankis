using System.Collections.Generic;
using System.Threading.Tasks;
using HealthSharingPortal.API.AccessControl;

namespace HealthSharingPortal.API.Workflow;

public interface IAccountDeleter
{
    Task<AccountDeleterResult> DeleteAsync(
        string accountId,
        List<IPersonDataAccessGrant> accessGrants,
        PersonDataChangeMetadata changedBy);
}

public class AccountDeleterResult
{
    private AccountDeleterResult(bool isSuccess, string errorMessage)
    {
        IsSuccess = isSuccess;
        ErrorMessage = errorMessage;
    }

    public bool IsSuccess { get; }
    public string ErrorMessage { get; }

    public static AccountDeleterResult Success() => new AccountDeleterResult(true, null);
    public static AccountDeleterResult Failed(string errorMessage) => new AccountDeleterResult(false, errorMessage);
}