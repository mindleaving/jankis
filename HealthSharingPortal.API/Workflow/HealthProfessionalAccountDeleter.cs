using System.Collections.Generic;
using System.Threading.Tasks;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Storage;

namespace HealthSharingPortal.API.Workflow;

public class HealthProfessionalAccountDeleter : IAccountDeleter
{
    private readonly IAccountStore accountStore;

    public HealthProfessionalAccountDeleter(
        IAccountStore accountStore)
    {
        this.accountStore = accountStore;
    }

    public async Task<AccountDeleterResult> DeleteAsync(
        string accountId,
        List<IPersonDataAccessGrant> accessGrants,
        PersonDataChangeMetadata changedBy)
    {
        await accountStore.DeleteAsync(accountId);
        return AccountDeleterResult.Success();
    }
}