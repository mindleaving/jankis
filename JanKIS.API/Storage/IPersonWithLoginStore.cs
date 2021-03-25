using System.Threading.Tasks;
using JanKIS.API.Models;

namespace JanKIS.API.Storage
{
    public interface IPersonWithLoginStore<T> : IStore<T> where T: PersonWithLogin
    {
        Task<StorageResult> ChangePasswordAsync(string userId, string passwordBase64, bool changePasswordOnNextLogin);
        Task<StorageResult> AddRole(string userId, string roleId);
        Task<StorageResult> RemoveRole(string userId, string roleId);
        Task<StorageResult> AddPermission(string userId, PermissionModifier permission);
        Task<StorageResult> RemovePermission(string userId, Permission permission);
        Task RemoveRoleFromAllUsers(string roleName);
    }
}