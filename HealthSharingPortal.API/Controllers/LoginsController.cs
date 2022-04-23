using System.Linq;
using System.Net;
using System.Threading.Tasks;
using HealthModels.AccessControl;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginsController : ControllerBase
    {
        private readonly ILoginStore store;
        private readonly IHttpContextAccessor httpContextAccessor;

        public LoginsController(
            ILoginStore store,
            IHttpContextAccessor httpContextAccessor)
        {
            this.store = store;
            this.httpContextAccessor = httpContextAccessor;
        }


        [Authorize]
        [AllowAnonymous]
        [HttpGet("is-logged-in")]
        public IActionResult IsLoggedIn()
        {
            var isLoggedIn = httpContextAccessor.HttpContext?.User.Identities.Any(x => x.IsAuthenticated) ?? false;
            return isLoggedIn ? Ok() : StatusCode((int)HttpStatusCode.Unauthorized);
        }

        [AllowAnonymous]
        [HttpGet("{username}/exists")]
        public async Task<IActionResult> Exists([FromRoute] string username)
        {
            return await store.ExistsAsync(username) ? Ok() : NotFound();
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> CreateLogin([FromBody] LoginCreationInfo creationInfo)
        {
            if (await store.ExistsAsync(creationInfo.Username))
                return Conflict($"Username '{creationInfo.Username}' is already taken");
            var login = LocalLoginFactory.Create(creationInfo.Username, creationInfo.Password);
            await store.StoreAsync(login);
            return Ok();
        }

    }
}
