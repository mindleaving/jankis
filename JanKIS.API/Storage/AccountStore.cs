using System.Collections.Generic;
using System.Threading.Tasks;
using JanKIS.API.AccessManagement;
using JanKIS.API.Models;
using MongoDB.Driver;

namespace JanKIS.API.Storage
{
    public class AccountStore: GenericStore<Account>, IAccountStore
    {
        public AccountStore(IMongoDatabase mongoDatabase,
            IPermissionFilterBuilder<Account> permissionFilterBuilder)
            : base(mongoDatabase, permissionFilterBuilder)
        {
        }

        public async Task<StorageResult> ChangePasswordAsync(
            string username,
            string passwordBase64,
            bool changePasswordOnNextLogin)
        {
            var result = await collection.UpdateOneAsync(
                x => x.Id == username, 
                Builders<Account>.Update
                    .Set(x => x.PasswordHash, passwordBase64)
                    .Set(x => x.IsPasswordChangeRequired, changePasswordOnNextLogin));
            if(!result.IsAcknowledged)
                return StorageResult.Error(StoreErrorType.UnknownDatabaseError);
            if(result.MatchedCount == 0)
                return StorageResult.Error(StoreErrorType.NoMatch);
            return StorageResult.Success();
        }

        public async Task<StorageResult> SetRoles(
            string username,
            List<string> roleIds)
        {
            var result = await collection.OfType<EmployeeAccount>().UpdateOneAsync(
                x => x.Id == username,
                Builders<EmployeeAccount>.Update
                    .Set(x => x.Roles, roleIds));
            if(!result.IsAcknowledged)
                return StorageResult.Error(StoreErrorType.UnknownDatabaseError);
            if(result.MatchedCount == 0)
                return StorageResult.Error(StoreErrorType.NoMatch);
            return StorageResult.Success();
        }

        public async Task<StorageResult> AddRole(
            string username,
            string roleId)
        {
            if(await collection.OfType<EmployeeAccount>().Find(x => x.Id == username && x.Roles.Contains(roleId)).AnyAsync())
                return StorageResult.Success();
            var result = await collection.OfType<EmployeeAccount>().UpdateOneAsync(
                x => x.Id == username,
                Builders<EmployeeAccount>.Update
                    .Push(x => x.Roles, roleId));
            if(!result.IsAcknowledged)
                return StorageResult.Error(StoreErrorType.UnknownDatabaseError);
            if(result.MatchedCount == 0)
                return StorageResult.Error(StoreErrorType.NoMatch);
            return StorageResult.Success();
        }

        public async Task<StorageResult> RemoveRole(
            string username,
            string roleId)
        {
            if(await collection.OfType<EmployeeAccount>().Find(x => x.Id == username && !x.Roles.Contains(roleId)).AnyAsync())
                return StorageResult.Success();
            var result = await collection.OfType<EmployeeAccount>().UpdateOneAsync(
                x => x.Id == username,
                Builders<EmployeeAccount>.Update
                    .Pull(x => x.Roles, roleId));
            if(!result.IsAcknowledged)
                return StorageResult.Error(StoreErrorType.UnknownDatabaseError);
            if(result.MatchedCount == 0)
                return StorageResult.Error(StoreErrorType.NoMatch);
            return StorageResult.Success();
        }

        public async Task<StorageResult> AddPermission(
            string username,
            PermissionModifier permission)
        {
            var result = await collection.OfType<EmployeeAccount>().UpdateOneAsync(
                x => x.Id == username,
                Builders<EmployeeAccount>.Update
                    .Push(x => x.PermissionModifiers, permission));
            if(!result.IsAcknowledged)
                return StorageResult.Error(StoreErrorType.UnknownDatabaseError);
            if(result.MatchedCount == 0)
                return StorageResult.Error(StoreErrorType.NoMatch);
            return StorageResult.Success();
        }

        public async Task<StorageResult> RemovePermission(
            string username,
            Permission permission)
        {
            var result = await collection.OfType<EmployeeAccount>().UpdateOneAsync(
                x => x.Id == username,
                Builders<EmployeeAccount>.Update
                    .PullFilter(x => x.PermissionModifiers, x => x.Permission == permission));
            if(!result.IsAcknowledged)
                return StorageResult.Error(StoreErrorType.UnknownDatabaseError);
            if(result.MatchedCount == 0)
                return StorageResult.Error(StoreErrorType.NoMatch);
            return StorageResult.Success();
        }

        public async Task RemoveRoleFromAllUsers(string roleName)
        {
            await collection.OfType<EmployeeAccount>().UpdateManyAsync(
                x => true,
                Builders<EmployeeAccount>.Update.Pull(x => x.Roles, roleName));
        }

        public async Task<bool> IsEmployee(string username)
        {
            var account = await GetByIdAsync(username);
            return account.AccountType == AccountType.Employee;
        }

        public Task DeleteAllForPerson(string personId)
        {
            return collection.DeleteManyAsync(x => x.PersonId == personId);
        }
    }
}
