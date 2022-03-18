using System;
using System.Threading.Tasks;
using HealthModels.AccessControl;
using HealthSharingPortal.API.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AccessRequestsController : ControllerBase
    {
        private readonly IStore<IAccessRequest> requestStore;
        private readonly IStore<ISharedAccess> accessStore;

        public AccessRequestsController(IStore<IAccessRequest> requestStore, IStore<ISharedAccess> accessStore)
        {
            this.requestStore = requestStore;
            this.accessStore = accessStore;
        }

        [HttpPost("create/emergency")]
        public async Task<IActionResult> CreateEmergency(EmergencyAccessRequest accessRequest)
        {
            // TODO: Check all necessary information available (validate requesterId)
            // TODO: Check permissions for requester to create an emergency (is health professional, has not reached current maximum of emergencies (=1))
            await requestStore.StoreAsync(accessRequest);
            return Ok(accessRequest);
        }

        [HttpPost("create/healthprofessional")]
        public async Task<IActionResult> CreateForHealthProfessional(HealthProfessionalAccessRequest accessRequest)
        {
            // TODO: Check all necessary information available (validate requesterId)
            // TODO: Check permissions for requester to request access (is health professional or is sharer, both can initiate)
            await requestStore.StoreAsync(accessRequest);
            return Ok(accessRequest);
        }

        [HttpPost("create/research")]
        public async Task<IActionResult> CreateForResearch(ResearchAccessRequest accessRequest)
        {
            // TODO: Check all necessary information available (validate requesterId)
            // TODO: Check permissions for requester to request access (is health professional or is sharer, both can initiate)
            await requestStore.StoreAsync(accessRequest);
            return Ok(accessRequest);
        }


        [HttpPost("access/emergency")]
        public async Task<IActionResult> RequestEmergencyAccess(EmergencyAccessRequest accessRequest)
        {
            // TODO: Check all necessary information (validate requesterId)
            // TODO: Check permissions to access the requested person
            var now = DateTime.UtcNow;
            var emergencyAccess = new EmergencyAccess
            {
                Id = accessRequest.Id,
                RequesterId = accessRequest.RequesterId,
                TargetPersonId = accessRequest.TargetPersonId,
                AccessGrantedTimestamp = now,
                AccessEndTimestamp = now.AddMinutes(60)
            };
            return Ok(emergencyAccess);
        }

        [HttpPost("access/healthprofessional")]
        public async Task<IActionResult> RequestHealthProfessionalAccess(HealthProfessionalAccessRequest accessRequest)
        {
            // TODO: Check all necessary information (validate requesterId)
            // TODO: Check permissions to access the requested person
            var now = DateTime.UtcNow;
            var healthProfessionalAccess = new HealthProfessionalAccess
            {
                Id = accessRequest.Id,
                RequesterId = accessRequest.RequesterId,
                TargetPersonId = accessRequest.TargetPersonId,
                AccessGrantedTimestamp = now,
                AccessEndTimestamp = now.AddMinutes(60)
            };
            return Ok(healthProfessionalAccess);
        }

        [HttpPost("access/research")]
        public async Task<IActionResult> RequestResearchAccess(ResearchAccessRequest accessRequest)
        {
            // TODO: Check all necessary information (validate requesterId)
            // TODO: Check permissions to access the requested person
            var now = DateTime.UtcNow;
            var researchAccess = new ResearchAccess()
            {
                Id = accessRequest.Id,
                RequesterId = accessRequest.RequesterId,
                TargetPersonId = accessRequest.TargetPersonId,
                StudyId = accessRequest.StudyId,
                AccessGrantedTimestamp = now,
                AccessFilters = accessRequest.AccessFilters
            };
            return Ok(researchAccess);
        }


        [HttpPost("{accessId}/revoke")]
        public async Task<IActionResult> RevokeAccess(string accessId)
        {
            var matchingItem = await accessStore.GetByIdAsync(accessId);
            if (matchingItem == null)
                return NotFound();
            // TODO: Check permissions to revoke
            if (matchingItem.IsRevoked)
                return Ok();
            matchingItem.IsRevoked = true;
            matchingItem.AccessEndTimestamp = DateTime.UtcNow;
            await accessStore.StoreAsync(matchingItem);
            return Ok();
        }

    }
}
