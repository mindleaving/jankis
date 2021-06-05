using System;
using System.Collections.Generic;
using System.Security;
using System.Threading.Tasks;
using JanKIS.API.AccessManagement;
using JanKIS.API.Models;
using MongoDB.Driver;

namespace JanKIS.API.Storage
{
    public class AccountStore: GenericStore<Account>, IAccountStore
    {
        public AccountStore(IMongoDatabase mongoDatabase)
            : base(mongoDatabase)
        {
        }

        public async Task<StorageResult> ChangePasswordAsync(
            string username,
            string passwordBase64,
            bool changePasswordOnNextLogin, 
            PermissionFilter<Account> permissionFilter)
        {
            ValidatePermissionFilter(permissionFilter, DataAccessType.Store);
            TODO: NotImplementedException method for testing ability to perform operation on as Single object
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
            List<string> roleIds, 
            PermissionFilter<Account> permissionFilter)
        {
            ValidatePermissionFilter(permissionFilter, DataAccessType.Store);
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
            string roleId, 
            PermissionFilter<Account> permissionFilter)
        {
            ValidatePermissionFilter(permissionFilter, DataAccessType.Store);
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
            string roleId, 
            PermissionFilter<Account> permissionFilter)
        {
            ValidatePermissionFilter(permissionFilter, DataAccessType.Store);
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
            PermissionModifier permission, 
            PermissionFilter<Account> permissionFilter)
        {
            ValidatePermissionFilter(permissionFilter, DataAccessType.Store);
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
            Permission permission, 
            PermissionFilter<Account> permissionFilter)
        {
            ValidatePermissionFilter(permissionFilter, DataAccessType.Store);
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

        public async Task RemoveRoleFromAllUsers(
            string roleName, 
            PermissionFilter<Account> permissionFilter)
        {
            ValidatePermissionFilter(permissionFilter, DataAccessType.Store);
            if (permissionFilter.AuthorizationLevel == AuthorizationLevel.FilteredAuthorization)
            {
                // Because this method is usually called before deleting the role,
                // it is necessary that the role is removed from all accounts,
                // not only those the current user has access to.
                throw new NotSupportedException();
            }
            await collection.OfType<EmployeeAccount>().UpdateManyAsync(
                x => true,
                Builders<EmployeeAccount>.Update.Pull(x => x.Roles, roleName));
        }

        public async Task<bool> IsEmployee(
            string username,
            PermissionFilter<Account> permissionFilter)
        {
            ValidatePermissionFilter(permissionFilter, DataAccessType.Read);
            var account = await GetByIdAsync(username, permissionFilter);
            return account.AccountType == AccountType.Employee;
        }

        public Task DeleteAllForPerson(
            string personId,
            PermissionFilter<Account> permissionFilter)
        {
            ValidatePermissionFilter(permissionFilter, DataAccessType.Delete);
            if (permissionFilter.AuthorizationLevel == AuthorizationLevel.FilteredAuthorization)
                throw new NotSupportedException();
            return collection.DeleteManyAsync(x => x.PersonId == personId);
        }
    }
}
