using System;
using System.Threading.Tasks;
using HealthModels.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
        private readonly IHttpContextAccessor httpContextAccessor;

        public AccessRequestsController(
            IStore<IAccessRequest> requestStore, 
            IStore<ISharedAccess> accessStore, 
            IHttpContextAccessor httpContextAccessor)
        {
            this.requestStore = requestStore;
            this.accessStore = accessStore;
            this.httpContextAccessor = httpContextAccessor;
        }

        [HttpGet("outgoing")]
        public async Task<IActionResult> GetAllMyOutgoingAccessRequests()
        {
            var personId = ControllerHelpers.GetPersonId(httpContextAccessor);
            var outgoingRequests = await requestStore.SearchAsync(x => !x.IsCompleted && x.RequesterId == personId);
            return Ok(outgoingRequests);
        }

        [HttpGet("incoming")]
        public async Task<IActionResult> GetAllMyIncomingAccessRequests()
        {
            var personId = ControllerHelpers.GetPersonId(httpContextAccessor);
            var incomingRequests = await requestStore.SearchAsync(x => !x.IsCompleted && x.TargetPersonId == personId);
            return Ok(incomingRequests);
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


        [HttpPost("accept/emergency")]
        public async Task<IActionResult> AcceptEmergencyAccess(EmergencyAccessRequest accessRequest)
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

        [HttpPost("accept/healthprofessional")]
        public async Task<IActionResult> AcceptHealthProfessionalAccess(HealthProfessionalAccessRequest accessRequest)
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

        [HttpPost("accept/research")]
        public async Task<IActionResult> AcceptResearchAccess(ResearchAccessRequest accessRequest)
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
