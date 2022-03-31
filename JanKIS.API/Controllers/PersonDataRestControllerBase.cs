using System.Threading.Tasks;
using HealthModels;
using JanKIS.API.AccessManagement;
using JanKIS.API.Helpers;
using JanKIS.API.Storage;
using Microsoft.AspNetCore.Http;

namespace JanKIS.API.Controllers
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
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            var currentUserPersonId = ControllerHelpers.GetPersonId(httpContextAccessor);
            return await authorizationModule.HasPermissionForPerson(personId, accountType.Value, username, currentUserPersonId);
        }
    }
}