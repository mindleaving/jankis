using System.Collections.Generic;
using System.Threading.Tasks;
using JanKIS.API.AccessManagement;
using JanKIS.API.Models;

namespace JanKIS.API.Storage
{
    public interface IAccountStore : IStore<Account>
    {
        Task<StorageResult> ChangePasswordAsync(
            string username,
            string passwordBase64,
            bool changePasswordOnNextLogin,
            PermissionFilter<Account> permissionFilter);

        Task<StorageResult> SetRoles(
            string username,
            List<string> roleIds,
            PermissionFilter<Account> permissionFilter);

        Task<StorageResult> AddRole(
            string username,
            string roleId,
            PermissionFilter<Account> permissionFilter);

        Task<StorageResult> RemoveRole(
            string username,
            string roleId,
            PermissionFilter<Account> permissionFilter);

        Task<StorageResult> AddPermission(
            string username,
            PermissionModifier permission,
            PermissionFilter<Account> permissionFilter);

        Task<StorageResult> RemovePermission(
            string username,
            Permission permission,
            PermissionFilter<Account> permissionFilter);

        Task RemoveRoleFromAllUsers(
            string roleName,
            PermissionFilter<Account> permissionFilter);

        Task<bool> IsEmployee(
            string username,
            PermissionFilter<Account> permissionFilter);

        Task DeleteAllForPerson(
            string personId,
            PermissionFilter<Account> permissionFilter);
    }
}