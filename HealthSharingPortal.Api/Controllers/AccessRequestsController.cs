using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security;
using System.Threading.Tasks;
using Commons.Extensions;
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
    public class AccessRequestsController : ControllerBase
    {
        private readonly IStore<EmergencyAccessRequest> emergencyRequestStore;
        private readonly IStore<EmergencyAccess> emergencyAccessStore;
        private readonly IHealthProfessionalAccessInviteStore healthProfessionalRequestStore;
        private readonly IStore<HealthProfessionalAccess> healthProfessionalAccessStore;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IReadonlyStore<Person> personStore;
        private readonly IReadonlyStore<Account> accountStore;
        private readonly IAccessRequestDistributor accessRequestDistributor;

        public AccessRequestsController(
            IHttpContextAccessor httpContextAccessor, 
            IStore<EmergencyAccessRequest> emergencyRequestStore, 
            IStore<EmergencyAccess> emergencyAccessStore,
            IHealthProfessionalAccessInviteStore healthProfessionalRequestStore, 
            IStore<HealthProfessionalAccess> healthProfessionalAccessStore,
            IReadonlyStore<Person> personStore,
            IReadonlyStore<Account> accountStore,
            IAccessRequestDistributor accessRequestDistributor)
        {
            this.httpContextAccessor = httpContextAccessor;
            this.emergencyRequestStore = emergencyRequestStore;
            this.emergencyAccessStore = emergencyAccessStore;
            this.healthProfessionalRequestStore = healthProfessionalRequestStore;
            this.healthProfessionalAccessStore = healthProfessionalAccessStore;
            this.personStore = personStore;
            this.accountStore = accountStore;
            this.accessRequestDistributor = accessRequestDistributor;
        }

        [HttpGet("outgoing")]
        public async Task<IActionResult> GetAllMyOutgoingAccessRequests()
        {
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            if (accountType != AccountType.HealthProfessional)
                return Ok(new List<IAccessRequest>());

            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            var emergencyRequsts = await emergencyRequestStore.SearchAsync(x => 
                !x.IsCompleted
                && x.AccessReceiverUsername == username);
            var ordinaryRequests = await healthProfessionalRequestStore.SearchAsync(x => 
                !x.IsCompleted 
                && !x.IsRejected
                && !x.IsRevoked
                && x.AccessReceiverUsername == username, 
                AccountType.HealthProfessional);
            return Ok(emergencyRequsts.Cast<IAccessRequest>().Concat(ordinaryRequests));
        }

        [HttpGet("incoming")]
        public async Task<IActionResult> GetAllMyIncomingAccessRequests()
        {
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            if (accountType != AccountType.Sharer)
                return Ok(new List<IAccessRequest>());

            var personId = ControllerHelpers.GetPersonId(httpContextAccessor);
            var emergencyRequsts = await emergencyRequestStore.SearchAsync(x => 
                !x.IsCompleted 
                && x.SharerPersonId == personId);
            var healthProfessionalRequests = await healthProfessionalRequestStore.SearchAsync(x => 
                !x.IsCompleted 
                && !x.IsRejected
                && !x.IsRevoked
                && x.SharerPersonId == personId, 
                AccountType.Sharer);
            return Ok(emergencyRequsts.Cast<IAccessRequest>().Concat(healthProfessionalRequests));
        }


        [HttpPost("create/emergency")]
        public async Task<IActionResult> CreateEmergency([FromBody] EmergencyAccessRequest accessRequest)
        {
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            if (accountType != AccountType.HealthProfessional)
                return StatusCode((int)HttpStatusCode.Forbidden, "Only health professionals can get emergency access");
            var requesterId = ControllerHelpers.GetPersonId(httpContextAccessor);
            if (await HasReachedMaximumAllowedEmergencyRequests(requesterId))
                return StatusCode((int)HttpStatusCode.TooManyRequests, "You have reached the maximum amount of emergency requests for now");
            accessRequest.Id = Guid.NewGuid().ToString();
            var utcNow = DateTime.UtcNow;
            accessRequest.AccessReceiverUsername = requesterId;
            accessRequest.CreatedTimestamp = utcNow;
            await emergencyRequestStore.StoreAsync(accessRequest);
            var matchingPerson = await FindMatchingPerson(accessRequest);
            if (matchingPerson == null)
                return NotFound("No person matching the ID or name/birthdate in the portal");
            accessRequest.SharerPersonId = matchingPerson.Id;
            accessRequest.IsCompleted = true;
            accessRequest.CompletedTimestamp = utcNow;
            await emergencyRequestStore.StoreAsync(accessRequest);
            var emergencyAccess = new EmergencyAccess
            {
                Id = accessRequest.Id,
                AccessReceiverUsername = requesterId,
                SharerPersonId = matchingPerson.Id,
                AccessGrantedTimestamp = utcNow,
                AccessEndTimestamp = utcNow.AddMinutes(60)
            };
            return Ok(emergencyAccess);
        }

        private async Task<Person> FindMatchingPerson(EmergencyAccessRequest emergencyAccessRequest)
        {
            if (!string.IsNullOrEmpty(emergencyAccessRequest.SharerPersonId))
            {
                return await personStore.GetByIdAsync(emergencyAccessRequest.SharerPersonId);
            }

            var matchingPersons = await personStore.SearchAsync(
                x => x.FirstName.ToLower() == emergencyAccessRequest.TargetPersonFirstName.ToLower()
                     && x.LastName.ToLower() == emergencyAccessRequest.TargetPersonLastName.ToLower()
                     && x.BirthDate == emergencyAccessRequest.TargetPersonBirthdate);
            if (matchingPersons.Count == 1)
                return matchingPersons[0];
            return null;
        }

        private async Task<bool> HasReachedMaximumAllowedEmergencyRequests(string requesterId)
        {
            const int MaximumFailedAttempts = 10;
            var timeRangeStart = DateTime.UtcNow.Subtract(TimeSpan.FromMinutes(60));
            var emergencyRequests = await emergencyRequestStore.SearchAsync(x => x.AccessReceiverUsername == requesterId && x.CreatedTimestamp > timeRangeStart);
            var completedCount = emergencyRequests.Count(x => x.IsCompleted);
            return emergencyRequests.Count - completedCount > MaximumFailedAttempts;
        }

        [HttpPost("create/healthprofessional/{healthProfessionalUsername}")]
        public async Task<IActionResult> CreateForHealthProfessional([FromRoute] string healthProfessionalUsername)
        {
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            if (accountType != AccountType.Sharer)
                return StatusCode((int)HttpStatusCode.Forbidden, "Only data sharers can give access to health professionals");
            var matchingHealthProfessionalAccount = await accountStore
                .SearchAsync(x => x.AccountType == AccountType.HealthProfessional && x.Username == healthProfessionalUsername);
            if (matchingHealthProfessionalAccount == null)
                return BadRequest($"Unknown health professional '{healthProfessionalUsername}'");
            var sharerPersonId = ControllerHelpers.GetPersonId(httpContextAccessor);
            var accessInviteId = await healthProfessionalRequestStore.CreateNew(healthProfessionalUsername, sharerPersonId);

            // Distribute to health professional
            var storedAccessInviteForHealthProfessional = await healthProfessionalRequestStore.GetByIdAndRemoveCode(accessInviteId, AccountType.HealthProfessional);
            await accessRequestDistributor.NotifyHealthProfessionalAboutNewHealthProfessionalAccessInvite(storedAccessInviteForHealthProfessional);

            // Return updated access invite to sharer
            var storedAccessInviteForSharer = await healthProfessionalRequestStore.GetByIdAndRemoveCode(accessInviteId, AccountType.Sharer);
            return Ok(storedAccessInviteForSharer);
        }

        [HttpGet("healthprofessional/{requestId}")]
        public async Task<IActionResult> GetAccessRequest([FromRoute] string requestId)
        {
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            HealthProfessionalAccessInvite matchingAccessRequest;
            try
            {
                matchingAccessRequest = await healthProfessionalRequestStore.GetByIdAndRemoveCode(requestId, accountType.Value);
            }
            catch (SecurityException securityException)
            {
                return StatusCode((int)HttpStatusCode.Forbidden, securityException.Message);
            }
            if (matchingAccessRequest == null)
                return NotFound();
            if (accountType == AccountType.HealthProfessional)
            {
                var username = ControllerHelpers.GetUsername(httpContextAccessor);
                if (matchingAccessRequest.AccessReceiverUsername != username)
                    return Forbid();
                return Ok(matchingAccessRequest);
            }
            if (accountType == AccountType.Sharer)
            {
                var personId = ControllerHelpers.GetPersonId(httpContextAccessor);
                if (matchingAccessRequest.SharerPersonId != personId)
                    return Forbid();
                return Ok(matchingAccessRequest);
            }
            return Forbid();
        }


        [HttpPost("handshake/healthprofessional")]
        public async Task<IActionResult> AcceptHealthProfessionalAccess([FromBody] HealthProfessionalAccessInvite accessInvite)
        {
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            if (!accountType.InSet(AccountType.Sharer, AccountType.HealthProfessional))
                return Forbid();
            var matchingDatabaseEntry = await healthProfessionalRequestStore.GetByIdAndRemoveCode(accessInvite.Id, accountType.Value);
            if (matchingDatabaseEntry == null)
                return NotFound();
            if (accountType == AccountType.Sharer)
            {
                var personId = ControllerHelpers.GetPersonId(httpContextAccessor);
                if (matchingDatabaseEntry.SharerPersonId != personId)
                    return Forbid();
            }
            if (accountType == AccountType.HealthProfessional)
            {
                var username = ControllerHelpers.GetUsername(httpContextAccessor);
                if (matchingDatabaseEntry.AccessReceiverUsername != username)
                    return Forbid();
            }

            if (matchingDatabaseEntry.IsCompleted)
            {
                var access = await healthProfessionalAccessStore.GetByIdAsync(matchingDatabaseEntry.Id);
                return Ok(access);
            }

            if (accountType == AccountType.Sharer)
            {
                if (!await healthProfessionalRequestStore.CheckCodeFromSharer(accessInvite.Id, accessInvite.CodeForSharer))
                    return Unauthorized();
                await healthProfessionalRequestStore.SetSharerHasAccepted(matchingDatabaseEntry.Id);
            }
            if (accountType == AccountType.HealthProfessional)
            {
                if (!await healthProfessionalRequestStore.CheckCodeFromHealthProfessional(accessInvite.Id, accessInvite.CodeForHealthProfessional))
                    return Unauthorized();
                await healthProfessionalRequestStore.SetHealthProfessionalHasAccepted(matchingDatabaseEntry.Id);
            }

            matchingDatabaseEntry = await healthProfessionalRequestStore.GetByIdAndRemoveCode(accessInvite.Id, accountType.Value);
            if (await healthProfessionalRequestStore.TryMarkAsCompleted(matchingDatabaseEntry.Id))
            {
                var utcNow = DateTime.UtcNow;
                await healthProfessionalRequestStore.TryMarkAsCompleted(matchingDatabaseEntry.Id);
                var healthProfessionalAccess = new HealthProfessionalAccess
                {
                    Id = accessInvite.Id,
                    AccessReceiverUsername = accessInvite.AccessReceiverUsername,
                    SharerPersonId = accessInvite.SharerPersonId,
                    AccessGrantedTimestamp = utcNow,
                    AccessEndTimestamp = utcNow.AddMinutes(60)
                };
                await healthProfessionalAccessStore.StoreAsync(healthProfessionalAccess);
                await accessRequestDistributor.NotifyAccessGranted(healthProfessionalAccess);
                return Ok(healthProfessionalAccess);
            }
            return StatusCode((int)HttpStatusCode.Accepted);
        }

        [HttpPost("healthprofessional/{inviteId}/revoke")]
        [HttpPost("healthprofessional/{inviteId}/reject")]
        public async Task<IActionResult> Revoke([FromRoute] string inviteId)
        {
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            var accessInvite = await healthProfessionalRequestStore.GetByIdAndRemoveCode(inviteId, accountType.Value);
            if (accessInvite == null)
                return NotFound();
            if (accessInvite.IsCompleted)
                return StatusCode((int)HttpStatusCode.Locked, $"Invite has already been accepted and completed. To revoke access use api/accesses/healthprofessional/{inviteId}/revoke.");
            if (accountType == AccountType.Sharer)
            {
                var personId = ControllerHelpers.GetPersonId(httpContextAccessor);
                if (accessInvite.SharerPersonId != personId)
                    return Forbid();
                if (!await healthProfessionalRequestStore.Revoke(inviteId))
                    return StatusCode((int)HttpStatusCode.InternalServerError, "Could not revoke for an unknown reason");
            }
            else if (accountType == AccountType.HealthProfessional)
            {
                var username = ControllerHelpers.GetUsername(httpContextAccessor);
                if (accessInvite.AccessReceiverUsername != username)
                    return Forbid();
                if(!await healthProfessionalRequestStore.Reject(inviteId))
                    return StatusCode((int)HttpStatusCode.InternalServerError, "Could not reject for an unknown reason");
            }
            else
            {
                return Forbid();
            }
            
            return Ok();
        }

    }
}
