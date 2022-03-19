using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.Workflow;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AccessesController : ControllerBase
    {
        private readonly IStore<EmergencyAccess> emergencyAccessStore;
        private readonly IStore<HealthProfessionalAccess> healthProfessionalAccessStore;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly SharedAccessFilterer accessFilterer;

        public AccessesController(
            IStore<EmergencyAccess> emergencyAccessStore,
            IStore<HealthProfessionalAccess> healthProfessionalAccessStore,
            IHttpContextAccessor httpContextAccessor)
        {
            this.emergencyAccessStore = emergencyAccessStore;
            this.healthProfessionalAccessStore = healthProfessionalAccessStore;
            this.httpContextAccessor = httpContextAccessor;
            accessFilterer = new SharedAccessFilterer();
        }

        [HttpGet]
        public async Task<IActionResult> GetAccesses([FromQuery] bool onlyActive = false)
        {
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            if (accountType == AccountType.Sharer)
            {
                var personId = ControllerHelpers.GetPersonId(httpContextAccessor);
                var emergencyAccesses = await emergencyAccessStore.SearchAsync(x => x.SharerPersonId == personId);
                var healthProfessionalAccesses = await healthProfessionalAccessStore.SearchAsync(x => x.SharerPersonId == personId);
                var combinedAccesses = emergencyAccesses.Cast<ISharedAccess>().Concat(healthProfessionalAccesses);
                var filteredAccesses = accessFilterer.FilterAccesses(combinedAccesses, new SharedAccessFilter { OnlyActive = onlyActive });
                return Ok(filteredAccesses);
            }

            if (accountType == AccountType.HealthProfessional)
            {
                var username = ControllerHelpers.GetUsername(httpContextAccessor);
                var healthProfessionalAccesses = await healthProfessionalAccessStore.SearchAsync(x => x.AccessReceiverUsername == username);
                var filteredAccesses = accessFilterer.FilterAccesses(healthProfessionalAccesses, new SharedAccessFilter { OnlyActive = onlyActive });
                return Ok(filteredAccesses);
            }

            return Ok(new List<ISharedAccess>());
        }

        [HttpPost("{accessType}/{accessId}/revoke")]
        public async Task<IActionResult> RevokeAccess([FromRoute] SharedAccessType accessType, [FromRoute] string accessId)
        {
            var personId = ControllerHelpers.GetPersonId(httpContextAccessor);
            switch (accessType)
            {
                case SharedAccessType.Unknonw:
                    return BadRequest($"Invalid access type '{accessType}'");
                case SharedAccessType.HealthProfessional:
                {
                    return await RevokeAccess(healthProfessionalAccessStore, accessId, personId);
                }
                case SharedAccessType.Emergency:
                {
                    return await RevokeAccess(emergencyAccessStore, accessId, personId);
                }
                default:
                    throw new ArgumentOutOfRangeException(nameof(accessType), accessType, null);
            }
        }

        private async Task<IActionResult> RevokeAccess<T>(IStore<T> accessStore, string accessId, string personId) where T: ISharedAccess
        {
            var matchingItem = await accessStore.GetByIdAsync(accessId);
            if (matchingItem == null)
                return NotFound();
            if (!CanModifyAccess(matchingItem, personId))
                return StatusCode((int)HttpStatusCode.Forbidden, "");
            if (matchingItem.IsRevoked)
                return Ok();
            matchingItem.IsRevoked = true;
            matchingItem.AccessEndTimestamp = DateTime.UtcNow;
            await accessStore.StoreAsync(matchingItem);
            return Ok();
        }

        private bool CanModifyAccess(ISharedAccess access, string personId)
        {
            if(access.SharerPersonId == personId)
                return true;
            if (access.AccessReceiverUsername == personId)
                return true;
            return false;
        }
    }
}
