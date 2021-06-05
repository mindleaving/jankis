using System;
using System.Security;
using System.Threading.Tasks;
using JanKIS.API.AccessManagement;
using JanKIS.API.Models;
using MongoDB.Driver;

namespace JanKIS.API.Storage
{
    public class GenericStore<T> : GenericReadonlyStore<T>, IStore<T> where T : IId
    {
        public GenericStore(IMongoDatabase mongoDatabase)
            : base(mongoDatabase)
        {
        }

        public async Task<StorageOperation> StoreAsync(T item, PermissionFilter<T> permissionFilter)
        {
            ValidatePermissionFilter(permissionFilter, DataAccessType.Store);
            if (permissionFilter.IsAuthorizedTo(DataAccessType.Store, item))
                throw new SecurityException($"You are not authorized to store objects of type '{nameof(T)}'");
            var result = await collection.ReplaceOneAsync(x => x.Id == item.Id, item, new ReplaceOptions { IsUpsert = true });
            return result.MatchedCount == 1 ? StorageOperation.Changed : StorageOperation.Created;
        }

        public Task DeleteAsync(string id, PermissionFilter<T> permissionFilter)
        {
            ValidatePermissionFilter(permissionFilter, DataAccessType.Delete);
            if (permissionFilter.AuthorizationLevel == AuthorizationLevel.Unauthorized)
                throw new SecurityException($"You are not authorized to delete objects of type '{nameof(T)}'");
            return collection.DeleteOneAsync(x => x.Id == id);
        }
    }
}