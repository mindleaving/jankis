using System.Collections.Generic;
using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.API.AccessControl;

namespace HealthSharingPortal.API.Storage
{
    public interface IPersonDataStore
    {
        Task DeleteAllForPerson(
            string personId,
            List<IPersonDataAccessGrant> accessGrants,
            PersonDataChangeMetadata changedBy);
    }
    public interface IPersonDataStore<T> : IPersonDataStore, IPersonDataReadonlyStore<T> where T : IPersonData
    {
        Task<StorageOperation> StoreAsync(
            T item,
            List<IPersonDataAccessGrant> accessGrants,
            PersonDataChangeMetadata changedBy);
        Task DeleteAsync(
            string id,
            List<IPersonDataAccessGrant> accessGrants,
            PersonDataChangeMetadata changedBy);
    }
}