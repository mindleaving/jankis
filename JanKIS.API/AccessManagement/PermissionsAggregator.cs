using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JanKIS.API.Models;
using JanKIS.API.Storage;

namespace JanKIS.API.AccessManagement
{
    public class PermissionsAggregator
    {
        private readonly IReadonlyStore<Role> rolesStore;

        public PermissionsAggregator(IReadonlyStore<Role> rolesStore)
        {
            this.rolesStore = rolesStore;
        }

        public async Task<List<Permission>> Aggregate(
            List<string> roleIds,
            List<PermissionModifier> permissionModifiers)
        {
            var allRoles = await rolesStore.GetAllAsync();
            var roles = allRoles.Where(role => roleIds.Contains(role.Id)).ToList();
            return Aggregate(roles, permissionModifiers);
        }

        public List<Permission> Aggregate(
            List<Role> roles,
            List<PermissionModifier> permissionModifiers)
        {
            var explicitlyGranted = permissionModifiers.Where(x => x.Type == PermissionModifierType.Grant).Select(x => x.Permission);
            var explicitlyDenied = permissionModifiers.Where(x => x.Type == PermissionModifierType.Deny).Select(x => x.Permission);
            return roles
                .SelectMany(role => role.Permissions)
                .Concat(explicitlyGranted)
                .Distinct()
                .Except(explicitlyDenied) // Order is important. If permission is both granted AND denied (shouldn't happen, but if it does) it is denied
                .ToList();
        }
    }
}
