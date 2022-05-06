using System;
using System.Linq;
using System.Net;
using System.Security;
using System.Threading.Tasks;
using Commons.Extensions;
using HealthModels;
using HealthModels.AccessControl;
using HealthModels.Interview;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.ViewModels;
using HealthSharingPortal.API.Workflow;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using IAuthenticationModule = HealthSharingPortal.API.AccessControl.IAuthenticationModule;

namespace HealthSharingPortal.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AccessRequestsController : ControllerBase
    {
        private readonly IStore<EmergencyAccessRequest> emergencyRequestStore;
        private readonly IStore<EmergencyAccess> emergencyAccessStore;
        private readonly IHealthProfessionalAccessInviteStore healthProfessionalInviteStore;
        private readonly IStore<HealthProfessionalAccess> healthProfessionalAccessStore;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IPersonStore personStore;
        private readonly IReadonlyStore<Account> accountStore;
        private readonly IAccessRequestDistributor accessRequestDistributor;
        private readonly IAuthenticationModule authenticationModule;

        public AccessRequestsController(
            IHttpContextAccessor httpContextAccessor, 
            IStore<EmergencyAccessRequest> emergencyRequestStore, 
            IStore<EmergencyAccess> emergencyAccessStore,
            IHealthProfessionalAccessInviteStore healthProfessionalInviteStore, 
            IStore<HealthProfessionalAccess> healthProfessionalAccessStore,
            IPersonStore personStore,
            IReadonlyStore<Account> accountStore,
            IAccessRequestDistributor accessRequestDistributor,
            IAuthenticationModule authenticationModule)
        {
            this.httpContextAccessor = httpContextAccessor;
            this.emergencyRequestStore = emergencyRequestStore;
            this.emergencyAccessStore = emergencyAccessStore;
            this.healthProfessionalInviteStore = healthProfessionalInviteStore;
            this.healthProfessionalAccessStore = healthProfessionalAccessStore;
            this.personStore = personStore;
            this.accountStore = accountStore;
            this.accessRequestDistributor = accessRequestDistributor;
            this.authenticationModule = authenticationModule;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllMyAccessInvites()
        {
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            if (accountType == AccountType.Sharer)
            {
                var personId = ControllerHelpers.GetPersonId(httpContextAccessor);
                var healthProfessionalRequests = await healthProfessionalInviteStore.SearchAsync(x => 
                        !x.IsCompleted 
                        && !x.IsRejected
                        && !x.IsRevoked
                        && x.SharerPersonId == personId, 
                    AccountType.Sharer);
                return Ok(healthProfessionalRequests);
            }
            if (accountType == AccountType.HealthProfessional)
            {
                var username = ControllerHelpers.GetAccountId(httpContextAccessor);
                var ordinaryRequests = await healthProfessionalInviteStore.SearchAsync(x => 
                        !x.IsCompleted 
                        && !x.IsRejected
                        && !x.IsRevoked
                        && x.AccessReceiverUsername == username, 
                    AccountType.HealthProfessional);
                return Ok(ordinaryRequests);
            }

            return Forbid();
        }


        [HttpPost("create/emergency")]
        public async Task<IActionResult> CreateEmergency([FromBody] EmergencyAccessRequest accessRequest)
        {
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            if (accountType != AccountType.HealthProfessional)
                return StatusCode((int)HttpStatusCode.Forbidden, "Only health professionals can get emergency access");
            var requesterUsername = ControllerHelpers.GetAccountId(httpContextAccessor);
            if (await HasReachedMaximumAllowedEmergencyRequests(requesterUsername))
                return StatusCode((int)HttpStatusCode.TooManyRequests, "You have reached the maximum amount of emergency requests for now");
            accessRequest.Id = Guid.NewGuid().ToString();
            var utcNow = DateTime.UtcNow;
            accessRequest.AccessReceiverUsername = requesterUsername;
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
                AccessReceiverAccountId = requesterUsername,
                SharerPersonId = matchingPerson.Id,
                AccessGrantedTimestamp = utcNow,
                AccessEndTimestamp = utcNow.AddMinutes(60)
            };
            await emergencyAccessStore.StoreAsync(emergencyAccess);
            return Ok(emergencyAccess);
        }

        [AllowAnonymous]
        [HttpPost("guest/create/emergency")]
        public async Task<IActionResult> CreateEmergencyGuestAccess(
            [FromBody] EmergencyAccessRequest guestAccessRequest,
            [FromQuery] Language language = Language.en)
        {
            if (string.IsNullOrWhiteSpace(guestAccessRequest.EmergencyToken))
                return BadRequest("Guest access can only be granted by providing an emergency token, but it was empty");
            var utcNow = DateTime.UtcNow;
            guestAccessRequest.Id = Guid.NewGuid().ToString();
            guestAccessRequest.AccessReceiverUsername = "guest";
            guestAccessRequest.CreatedTimestamp = utcNow;
            await emergencyRequestStore.StoreAsync(guestAccessRequest);
            var emergencyToken = await emergencyAccessStore.FirstOrDefaultAsync(x => 
                x.Token == guestAccessRequest.EmergencyToken
                && !x.IsRevoked
                && (x.AccessEndTimestamp == null || x.AccessEndTimestamp > utcNow));
            if (emergencyToken == null)
                return NotFound("Invalid emergency token");
            var matchingPerson = await personStore.GetByIdAsync(emergencyToken.SharerPersonId, AccessGrantHelpers.GrantReadAccessToAllPersons());
            if (matchingPerson == null)
                return NotFound("No matching person");
            guestAccessRequest.SharerPersonId = matchingPerson.Id;
            guestAccessRequest.IsCompleted = true;
            guestAccessRequest.CompletedTimestamp = utcNow;
            await emergencyRequestStore.StoreAsync(guestAccessRequest);
            var guestEmergencyAccess = new EmergencyAccess
            {
                Id = guestAccessRequest.Id,
                AccessReceiverAccountId = "guest",
                SharerPersonId = matchingPerson.Id,
                AccessGrantedTimestamp = utcNow,
                AccessEndTimestamp = utcNow.AddMinutes(60),
                Permissions = emergencyToken.Permissions
            };
            await emergencyAccessStore.StoreAsync(guestEmergencyAccess);
            var profileData = new Person(null, "Guest", "Guest", DateTime.UtcNow, Sex.Other);
            var authenticationResult = authenticationModule.BuildSecurityTokenForGuest(
                matchingPerson.Id, 
                guestEmergencyAccess.Permissions, 
                guestEmergencyAccess.Id);
            var userViewModel = new GuestViewModel(
                profileData,
                authenticationResult,
                AccountType.EmergencyGuest,
                language);
            var guestEmergencyAccessViewModel = new GuestEmergencyAccessViewModel
            {
                User = userViewModel,
                AccessInfo = guestEmergencyAccess
            };
            return Ok(guestEmergencyAccessViewModel);
        }

        private async Task<Person> FindMatchingPerson(EmergencyAccessRequest emergencyAccessRequest)
        {
            if (!string.IsNullOrEmpty(emergencyAccessRequest.SharerPersonId))
            {
                var emergencyReadAccessGrant = AccessGrantHelpers.GrantForPersonWithPermission(emergencyAccessRequest.SharerPersonId, AccessPermissions.Read);
                return await personStore.GetByIdAsync(
                    emergencyAccessRequest.SharerPersonId,
                    emergencyReadAccessGrant);
            }
            if (!string.IsNullOrWhiteSpace(emergencyAccessRequest.EmergencyToken))
            {
                var emergencyAccess = await emergencyAccessStore.FirstOrDefaultAsync(x => x.Token == emergencyAccessRequest.EmergencyToken);
                if (emergencyAccess == null)
                    return null;
                var emergencyReadAccessGrant = AccessGrantHelpers.GrantReadAccessToAllPersons();
                var matchingPerson = await personStore.GetByIdAsync(emergencyAccess.SharerPersonId, emergencyReadAccessGrant);
                return matchingPerson;
            }
            else
            {
                var emergencyReadAccessGrant = AccessGrantHelpers.GrantReadAccessToAllPersons();
                var nameMatchingPersons = await personStore.SearchByName(
                    emergencyAccessRequest.TargetPersonFirstName,
                    emergencyAccessRequest.TargetPersonLastName,
                    emergencyReadAccessGrant);
                var nameAndBirthdateMatchingPersons = nameMatchingPersons
                    .Where(x => (x.BirthDate - emergencyAccessRequest.TargetPersonBirthdate).Duration() < TimeSpan.FromHours(24))
                    .ToList();
                if (nameAndBirthdateMatchingPersons.Count == 1)
                    return nameAndBirthdateMatchingPersons[0];
                return null;
            }
        }

        private async Task<bool> HasReachedMaximumAllowedEmergencyRequests(string requesterId)
        {
            const int MaximumFailedAttempts = 10;
            var timeRangeStart = DateTime.UtcNow.Subtract(TimeSpan.FromMinutes(60));
            var emergencyRequests = await emergencyRequestStore.SearchAsync(x => x.AccessReceiverUsername == requesterId && x.CreatedTimestamp > timeRangeStart);
            var completedCount = emergencyRequests.Count(x => x.IsCompleted);
            return emergencyRequests.Count - completedCount > MaximumFailedAttempts;
        }

        [HttpPost("create/healthprofessional")]
        public async Task<IActionResult> CreateForHealthProfessional([FromBody] CreateAccessInviteBody body)
        {
            var healthProfessionalAccountId = body.HealthProfessionalAccountId;
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            if (accountType != AccountType.Sharer)
                return StatusCode((int)HttpStatusCode.Forbidden, "Only data sharers can give access to health professionals");
            var matchingHealthProfessionalAccount = await accountStore
                .SearchAsync(x => x.AccountType == AccountType.HealthProfessional && x.Id == healthProfessionalAccountId);
            if (matchingHealthProfessionalAccount == null)
                return BadRequest($"Unknown health professional '{healthProfessionalAccountId}'");
            if (!DateTimeHelpers.TryParseTimespan(body.ExpirationDuration, out var parsedExpirationDuration))
                parsedExpirationDuration = TimeSpan.FromMinutes(60);
            var sharerPersonId = ControllerHelpers.GetPersonId(httpContextAccessor);
            var accessInviteId = await healthProfessionalInviteStore.CreateNew(
                healthProfessionalAccountId, 
                sharerPersonId, 
                parsedExpirationDuration,
                body.Permissions);

            // Distribute to health professional
            var storedAccessInviteForHealthProfessional = await healthProfessionalInviteStore.GetByIdAndRemoveCode(accessInviteId, AccountType.HealthProfessional);
            await accessRequestDistributor.NotifyHealthProfessionalAboutNewHealthProfessionalAccessInvite(storedAccessInviteForHealthProfessional);

            // Return updated access invite to sharer
            var storedAccessInviteForSharer = await healthProfessionalInviteStore.GetByIdAndRemoveCode(accessInviteId, AccountType.Sharer);
            return Ok(storedAccessInviteForSharer);
        }

        [HttpGet("healthprofessional/{requestId}")]
        public async Task<IActionResult> GetAccessRequest([FromRoute] string requestId)
        {
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            HealthProfessionalAccessInvite matchingAccessRequest;
            try
            {
                matchingAccessRequest = await healthProfessionalInviteStore.GetByIdAndRemoveCode(requestId, accountType.Value);
            }
            catch (SecurityException securityException)
            {
                return StatusCode((int)HttpStatusCode.Forbidden, securityException.Message);
            }
            if (matchingAccessRequest == null)
                return NotFound();
            if (accountType == AccountType.HealthProfessional)
            {
                var username = ControllerHelpers.GetAccountId(httpContextAccessor);
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
            var matchingDatabaseEntry = await healthProfessionalInviteStore.GetByIdAndRemoveCode(accessInvite.Id, accountType.Value);
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
                var username = ControllerHelpers.GetAccountId(httpContextAccessor);
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
                if (!await healthProfessionalInviteStore.CheckCodeFromSharer(accessInvite.Id, accessInvite.CodeForSharer))
                    return Unauthorized();
                await healthProfessionalInviteStore.SetSharerHasAccepted(matchingDatabaseEntry.Id);
            }
            if (accountType == AccountType.HealthProfessional)
            {
                if (!await healthProfessionalInviteStore.CheckCodeFromHealthProfessional(accessInvite.Id, accessInvite.CodeForHealthProfessional))
                    return Unauthorized();
                await healthProfessionalInviteStore.SetHealthProfessionalHasAccepted(matchingDatabaseEntry.Id);
            }

            matchingDatabaseEntry = await healthProfessionalInviteStore.GetByIdAndRemoveCode(accessInvite.Id, accountType.Value);
            if (await healthProfessionalInviteStore.TryMarkAsCompleted(matchingDatabaseEntry.Id))
            {
                var utcNow = DateTime.UtcNow;
                await healthProfessionalInviteStore.TryMarkAsCompleted(matchingDatabaseEntry.Id);
                var healthProfessionalAccess = new HealthProfessionalAccess
                {
                    Id = accessInvite.Id,
                    AccessReceiverAccountId = accessInvite.AccessReceiverUsername,
                    SharerPersonId = accessInvite.SharerPersonId,
                    Permissions = matchingDatabaseEntry.Permissions,
                    AccessGrantedTimestamp = utcNow,
                    AccessEndTimestamp = utcNow.Add(accessInvite.ExpirationDuration)
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
            var accessInvite = await healthProfessionalInviteStore.GetByIdAndRemoveCode(inviteId, accountType.Value);
            if (accessInvite == null)
                return NotFound();
            if (accessInvite.IsCompleted)
                return StatusCode((int)HttpStatusCode.Locked, $"Invite has already been accepted and completed. To revoke access use api/accesses/healthprofessional/{inviteId}/revoke.");
            if (accountType == AccountType.Sharer)
            {
                var personId = ControllerHelpers.GetPersonId(httpContextAccessor);
                if (accessInvite.SharerPersonId != personId)
                    return Forbid();
                if (!await healthProfessionalInviteStore.Revoke(inviteId))
                    return StatusCode((int)HttpStatusCode.InternalServerError, "Could not revoke for an unknown reason");
            }
            else if (accountType == AccountType.HealthProfessional)
            {
                var username = ControllerHelpers.GetAccountId(httpContextAccessor);
                if (accessInvite.AccessReceiverUsername != username)
                    return Forbid();
                if(!await healthProfessionalInviteStore.Reject(inviteId))
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
