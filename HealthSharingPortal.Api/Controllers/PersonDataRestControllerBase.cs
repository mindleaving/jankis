using System.Linq;
using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Storage;
using Microsoft.AspNetCore.Http;

namespace HealthSharingPortal.API.Controllers
{
    public abstract class PersonDataRestControllerBase<T> : RestControllerBase<T> where T : class, IId
    {
        protected readonly IAuthorizationModule authorizationModule;

        protected PersonDataRestControllerBase(
            IStore<T> store,
            IHttpContextAccessor httpContextAccessor,
            IAuthorizationModule authorizationModule)
            : base(store, httpContextAccessor)
        {
            this.authorizationModule = authorizationModule;
        }

        protected async Task<bool> IsAuthorizedToAccessPerson(string personId)
        {
            var claims = ControllerHelpers.GetClaims(httpContextAccessor);
            return await authorizationModule.HasPermissionForPerson(personId, claims);
        }
    }
}