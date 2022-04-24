using System.Collections.Generic;
using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Storage;
using Microsoft.AspNetCore.Http;

namespace HealthSharingPortal.API.Helpers
{
    public static class PersonDataControllerHelpers
    {
        public static Task<StorageOperation> Store<T>(
            IPersonDataStore<T> personDataStore,
            T item,
            List<IPersonDataAccessGrant> accessGrants,
            IHttpContextAccessor httpContextAccessor) where T : IPersonData
        {
            var changeMetadata = new PersonDataChangeMetadata
            (
                ControllerHelpers.GetAccountId(httpContextAccessor),
                ControllerHelpers.GetPersonId(httpContextAccessor)
            );
            return personDataStore.StoreAsync(item, accessGrants, changeMetadata);
        }

        public static Task Delete<T>(
            IPersonDataStore<T> personDataStore,
            string id,
            List<IPersonDataAccessGrant> accessGrants,
            IHttpContextAccessor httpContextAccessor) where T : IPersonData
        {
            var changeMetadata = new PersonDataChangeMetadata
            (
                ControllerHelpers.GetAccountId(httpContextAccessor),
                ControllerHelpers.GetPersonId(httpContextAccessor)
            );
            return personDataStore.DeleteAsync(id, accessGrants, changeMetadata);
        }
    }
}
