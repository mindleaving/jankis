using System.Collections.Generic;
using System.Threading.Tasks;
using JanKIS.API.Models;

namespace JanKIS.API.Storage
{
    public interface IAccountStore : IStore<Account>
    {
        Task<StorageResult> ChangePasswordAsync(string username, string passwordBase64, bool changePasswordOnNextLogin);
        Task<StorageResult> SetRoles(string username, List<string> roleIds);
        Task<StorageResult> AddRole(string username, string roleId);
        Task<StorageResult> RemoveRole(string username, string roleId);
        Task<StorageResult> AddPermission(string username, PermissionModifier permission);
        Task<StorageResult> RemovePermission(string username, Permission permission);
        Task RemoveRoleFromAllUsers(string roleName);
    }
}