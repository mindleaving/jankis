using System.Collections.Generic;
using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.API.AccessControl;

namespace HealthSharingPortal.API.Storage
{
    public interface IPersonDataStore<T> : IPersonDataReadonlyStore<T> where T : IPersonData
    {
        Task<StorageOperation> StoreAsync(T item, List<PersonDataAccessGrant> accessGrants);
        Task DeleteAsync(string id, List<PersonDataAccessGrant> accessGrants);
    }
}