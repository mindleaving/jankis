using System.Threading.Tasks;
using JanKIS.API.Models;
using MongoDB.Driver;

namespace JanKIS.API.Storage
{
    public class UserStore<T> : GenericStore<T>, IPersonWithLoginStore<T> where T : PersonWithLogin
    {
        public UserStore(IMongoDatabase mongoDatabase)
            : base(mongoDatabase)
        {
        }

        public async Task<StorageResult> ChangePasswordAsync(
            string userId,
            string passwordBase64,
            bool changePasswordOnNextLogin)
        {
            var result = await collection.UpdateOneAsync(
                x => x.Id == userId, 
                Builders<T>.Update
                    .Set(x => x.PasswordHash, passwordBase64)
                    .Set(x => x.IsPasswordChangeRequired, changePasswordOnNextLogin));
            if(!result.IsAcknowledged)
                return StorageResult.Error(StoreErrorType.UnknownDatabaseError);
            if(result.ModifiedCount == 0)
                return StorageResult.Error(StoreErrorType.NoMatch);
            return StorageResult.Success();
        }

        public async Task<StorageResult> AddRole(
            string userId,
            string roleId)
        {
            if(await collection.Find(x => x.Id == userId && x.Roles.Contains(roleId)).AnyAsync())
                return StorageResult.Success();
            var result = await collection.UpdateOneAsync(
                x => x.Id == userId,
                Builders<T>.Update
                    .Push(x => x.Roles, roleId));
            if(!result.IsAcknowledged)
                return StorageResult.Error(StoreErrorType.UnknownDatabaseError);
            if(result.ModifiedCount == 0)
                return StorageResult.Error(StoreErrorType.NoMatch);
            return StorageResult.Success();
        }

        public async Task<StorageResult> RemoveRole(
            string userId,
            string roleId)
        {
            if(await collection.Find(x => x.Id == userId && !x.Roles.Contains(roleId)).AnyAsync())
                return StorageResult.Success();
            var result = await collection.UpdateOneAsync(
                x => x.Id == userId,
                Builders<T>.Update
                    .Pull(x => x.Roles, roleId));
            if(!result.IsAcknowledged)
                return StorageResult.Error(StoreErrorType.UnknownDatabaseError);
            if(result.ModifiedCount == 0)
                return StorageResult.Error(StoreErrorType.NoMatch);
            return StorageResult.Success();
        }

        public async Task<StorageResult> AddPermission(
            string userId,
            PermissionModifier permission)
        {
            var result = await collection.UpdateOneAsync(
                x => x.Id == userId,
                Builders<T>.Update
                    .Push(x => x.PermissionModifiers, permission));
            if(!result.IsAcknowledged)
                return StorageResult.Error(StoreErrorType.UnknownDatabaseError);
            if(result.ModifiedCount == 0)
                return StorageResult.Error(StoreErrorType.NoMatch);
            return StorageResult.Success();
        }

        public async Task<StorageResult> RemovePermission(
            string userId,
            Permission permission)
        {
            var result = await collection.UpdateOneAsync(
                x => x.Id == userId,
                Builders<T>.Update
                    .PullFilter(x => x.PermissionModifiers, x => x.Permission == permission));
            if(!result.IsAcknowledged)
                return StorageResult.Error(StoreErrorType.UnknownDatabaseError);
            if(result.ModifiedCount == 0)
                return StorageResult.Error(StoreErrorType.NoMatch);
            return StorageResult.Success();
        }

        public async Task RemoveRoleFromAllUsers(string roleName)
        {
            await collection.UpdateManyAsync(
                x => true,
                Builders<T>.Update.Pull(x => x.Roles, roleName));
        }
    }
}
