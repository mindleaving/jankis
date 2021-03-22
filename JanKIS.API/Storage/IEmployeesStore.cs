using System.Threading.Tasks;
using JanKIS.API.Models;
using MongoDB.Driver;

namespace JanKIS.API.Storage
{
    public interface IEmployeesStore : IStore<Employee>
    {
        Task<StorageResult> ChangePasswordAsync(string employeeId, string passwordBase64, bool changePasswordOnNextLogin);
        Task<StorageResult> AddRole(string employeeId, string roleId);
        Task<StorageResult> RemoveRole(string employeeId, string roleId);
        Task<StorageResult> AddPermission(string employeeId, PermissionModifier permission);
        Task<StorageResult> RemovePermission(string employeeId, Permission permission);
        Task RemoveRoleFromAllUsers(string roleName);
    }

    public class StorageResult
    {
        private StorageResult(
            bool isSuccess,
            StoreErrorType? errorType)
        {
            IsSuccess = isSuccess;
            ErrorType = errorType;
        }

        public static StorageResult Success()
        {
            return new StorageResult(true, null);
        }

        public static StorageResult Error(StoreErrorType errorType)
        {
            return new StorageResult(false, errorType);
        }

        public bool IsSuccess { get; }
        public StoreErrorType? ErrorType { get; }
    }

    public class EmployeesStore : GenericStore<Employee>, IEmployeesStore
    {
        public EmployeesStore(IMongoDatabase mongoDatabase)
            : base(mongoDatabase)
        {
        }

        public async Task<StorageResult> ChangePasswordAsync(
            string employeeId,
            string passwordBase64,
            bool changePasswordOnNextLogin)
        {
            var result = await collection.UpdateOneAsync(
                x => x.Id == employeeId, 
                Builders<Employee>.Update
                    .Set(x => x.PasswordHash, passwordBase64)
                    .Set(x => x.IsPasswordChangeRequired, changePasswordOnNextLogin));
            if(!result.IsAcknowledged)
                return StorageResult.Error(StoreErrorType.UnknownDatabaseError);
            if(result.ModifiedCount == 0)
                return StorageResult.Error(StoreErrorType.NoMatch);
            return StorageResult.Success();
        }

        public async Task<StorageResult> AddRole(
            string employeeId,
            string roleId)
        {
            if(await collection.Find(x => x.Id == employeeId && x.Roles.Contains(roleId)).AnyAsync())
                return StorageResult.Success();
            var result = await collection.UpdateOneAsync(
                x => x.Id == employeeId,
                Builders<Employee>.Update
                    .Push(x => x.Roles, roleId));
            if(!result.IsAcknowledged)
                return StorageResult.Error(StoreErrorType.UnknownDatabaseError);
            if(result.ModifiedCount == 0)
                return StorageResult.Error(StoreErrorType.NoMatch);
            return StorageResult.Success();
        }

        public async Task<StorageResult> RemoveRole(
            string employeeId,
            string roleId)
        {
            if(await collection.Find(x => x.Id == employeeId && !x.Roles.Contains(roleId)).AnyAsync())
                return StorageResult.Success();
            var result = await collection.UpdateOneAsync(
                x => x.Id == employeeId,
                Builders<Employee>.Update
                    .Pull(x => x.Roles, roleId));
            if(!result.IsAcknowledged)
                return StorageResult.Error(StoreErrorType.UnknownDatabaseError);
            if(result.ModifiedCount == 0)
                return StorageResult.Error(StoreErrorType.NoMatch);
            return StorageResult.Success();
        }

        public async Task<StorageResult> AddPermission(
            string employeeId,
            PermissionModifier permission)
        {
            var result = await collection.UpdateOneAsync(
                x => x.Id == employeeId,
                Builders<Employee>.Update
                    .Push(x => x.PermissionModifiers, permission));
            if(!result.IsAcknowledged)
                return StorageResult.Error(StoreErrorType.UnknownDatabaseError);
            if(result.ModifiedCount == 0)
                return StorageResult.Error(StoreErrorType.NoMatch);
            return StorageResult.Success();
        }

        public async Task<StorageResult> RemovePermission(
            string employeeId,
            Permission permission)
        {
            var result = await collection.UpdateOneAsync(
                x => x.Id == employeeId,
                Builders<Employee>.Update
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
                Builders<Employee>.Update.Pull(x => x.Roles, roleName));
        }
    }
}
