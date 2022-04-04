using System;
using System.Linq;
using System.Threading.Tasks;
using HealthModels.AccessControl;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class GenomeExplorerController : ControllerBase
    {
        private readonly IAuthorizationModule authorizationModule;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IStore<GenomeExplorerDeployment> deploymentStore;

        public GenomeExplorerController(
            IAuthorizationModule authorizationModule,
            IHttpContextAccessor httpContextAccessor,
            IStore<GenomeExplorerDeployment> deploymentStore)
        {
            this.authorizationModule = authorizationModule;
            this.httpContextAccessor = httpContextAccessor;
            this.deploymentStore = deploymentStore;
        }

        [HttpPost("deploy")]
        public async Task<IActionResult> DeployExplorerEnvironment([FromBody] GenomeExplorerDeployment deployment)
        {
            var claims = ControllerHelpers.GetClaims(httpContextAccessor);
            var accessGrant = await authorizationModule.GetAccessGrantForPerson(deployment.PersonId, claims);
            if (!accessGrant.Permissions.Contains(AccessPermissions.Read))
                return Forbid();

            // TODO: Implement

            var environmentId = Guid.NewGuid().ToString();
            deployment.EnvironmentUrl = $"https://genome.doctorstodo.com/{environmentId}?config={deployment.Id}/config.json";
            await deploymentStore.StoreAsync(deployment);
            return Ok(deployment);
        }

    }
}
