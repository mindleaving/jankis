using System.Collections.Generic;
using System.Threading.Tasks;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Storage;

namespace HealthSharingPortal.API.Workflow;

public class ResearcherAccountDeleter : IAccountDeleter
{
    private readonly IAccountStore accountStore;
    private readonly IStudyAssociationStore studyAssociationStore;

    public ResearcherAccountDeleter(
        IAccountStore accountStore,
        IStudyAssociationStore studyAssociationStore)
    {
        this.accountStore = accountStore;
        this.studyAssociationStore = studyAssociationStore;
    }

    public async Task<AccountDeleterResult> DeleteAsync(
        string accountId,
        List<IPersonDataAccessGrant> accessGrants,
        PersonDataChangeMetadata changedBy)
    {
        await studyAssociationStore.DeleteAllForAccount(accountId);
        await accountStore.DeleteAsync(accountId);
        return AccountDeleterResult.Success();
    }
}