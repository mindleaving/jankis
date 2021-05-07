using System.Threading.Tasks;

namespace JanKIS.API.AccessManagement
{
    public class UnrestrictedAccessPermissionFilterBuilder<T> : IPermissionFilterBuilder<T>
    {
        public Task<PermissionFilter<T>> Build()
        {
            return Task.FromResult(PermissionFilter<T>.FullyAuthorized());
        }
    }
}
