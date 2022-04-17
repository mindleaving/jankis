using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Threading.Tasks;
using HealthModels.AccessControl;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Models.Filters;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.Workflow;
using HealthSharingPortal.API.Workflow.ViewModelBuilders;
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
        private readonly IViewModelBuilder<ISharedAccess> viewModelBuilder;
        private readonly IAuthorizationModule authorizationModule;
        private readonly IEmergencyTokenGenerator emergencyTokenGenerator;

        public AccessesController(
            IStore<EmergencyAccess> emergencyAccessStore,
            IStore<HealthProfessionalAccess> healthProfessionalAccessStore,
            IHttpContextAccessor httpContextAccessor,
            IViewModelBuilder<ISharedAccess> viewModelBuilder,
            IAuthorizationModule authorizationModule,
            IEmergencyTokenGenerator emergencyTokenGenerator)
        {
            this.emergencyAccessStore = emergencyAccessStore;
            this.healthProfessionalAccessStore = healthProfessionalAccessStore;
            this.httpContextAccessor = httpContextAccessor;
            this.viewModelBuilder = viewModelBuilder;
            this.authorizationModule = authorizationModule;
            this.emergencyTokenGenerator = emergencyTokenGenerator;
            accessFilterer = new SharedAccessFilterer();
        }

        [HttpGet("emergency/{id}")]
        public async Task<IActionResult> GetEmergencyAccessById([FromRoute] string id,
            [FromQuery] bool includeToken = false)
        {
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            if (accountType != AccountType.Sharer)
                return Forbid("Only sharers can access their own emergency accesses");
            var emergencyAccess = await emergencyAccessStore.GetByIdAsync(id);
            if (emergencyAccess == null)
                return NotFound();
            var personId = ControllerHelpers.GetPersonId(httpContextAccessor);
            if (emergencyAccess.SharerPersonId != personId)
                return NotFound();
            if (!includeToken)
                emergencyAccess.Token = null;
            return Ok(emergencyAccess);
        }


        [HttpGet]
        [HttpGet("search")]
        public async Task<IActionResult> GetAccesses(
            string searchText = null,
            bool onlyActive = false,
            DateTime? startTime = null,
            DateTime? endTime = null,
            int? count = null,
            int? skip = null,
            string orderBy = null,
            OrderDirection orderDirection = OrderDirection.Ascending,
            bool includeEmergencyTokens = false)
        {
            var filter = new SharedAccessFilter
            {
                SearchText = searchText,
                OnlyActive = onlyActive,
                StartTime = startTime,
                EndTime = endTime
            };
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            IEnumerable<ISharedAccess> filteredAccesses;
            if (accountType == AccountType.Sharer)
            {
                var personId = ControllerHelpers.GetPersonId(httpContextAccessor);
                var emergencyAccesses = await emergencyAccessStore.SearchAsync(x => x.SharerPersonId == personId);
                var healthProfessionalAccesses = await healthProfessionalAccessStore.SearchAsync(x => x.SharerPersonId == personId);
                var combinedAccesses = emergencyAccesses.Cast<ISharedAccess>().Concat(healthProfessionalAccesses);
                filteredAccesses = accessFilterer.FilterAccesses(combinedAccesses, filter);
            }
            else if (accountType == AccountType.HealthProfessional)
            {
                var username = ControllerHelpers.GetAccountId(httpContextAccessor);
                var emergencyAccesses = await emergencyAccessStore.SearchAsync(x => x.AccessReceiverAccountId == username);
                var healthProfessionalAccesses = await healthProfessionalAccessStore.SearchAsync(x => x.AccessReceiverAccountId == username);
                var combinedAccesses = emergencyAccesses.Cast<ISharedAccess>().Concat(healthProfessionalAccesses);
                filteredAccesses = accessFilterer.FilterAccesses(combinedAccesses, filter);
            }
            else
            {
                filteredAccesses = Enumerable.Empty<ISharedAccess>();
            }

            var orderExpression = BuildOrderByExpression(orderBy);
            filteredAccesses = orderDirection == OrderDirection.Ascending
                ? filteredAccesses.OrderBy(orderExpression)
                : filteredAccesses.OrderByDescending(orderExpression);
            if (skip.HasValue)
                filteredAccesses = filteredAccesses.Skip(skip.Value);
            if (count.HasValue)
                filteredAccesses = filteredAccesses.Take(count.Value);
            var claims = ControllerHelpers.GetClaims(httpContextAccessor);
            var accessGrants = await authorizationModule.GetAccessGrants(claims);
            var transformedAccesses = await viewModelBuilder.BatchBuild(
                filteredAccesses.ToList(), 
                new AccessViewModelBuilderOptions
                {
                    AccessGrants = accessGrants,
                    IncludeEmergencyTokens = includeEmergencyTokens
                });
            return Ok(transformedAccesses);
        }

        [HttpPost("create/emergency")]
        public async Task<IActionResult> CreateEmergencyToken([FromBody] EmergencyAccess access)
        {
            if (access == null)
                return BadRequest("Missing body");
            var isExpired = access.AccessEndTimestamp != null && access.AccessEndTimestamp < DateTime.UtcNow;
            if (access.IsRevoked || isExpired)
                return BadRequest("Access is marked as revoked or is already expired, which is not valid for creating emergency tokens");
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            if (accountType != AccountType.Sharer)
                return Forbid("Only sharers can create emergency tokens to their profiles");
            access.Id = Guid.NewGuid().ToString();
            var personId = ControllerHelpers.GetPersonId(httpContextAccessor);
            access.SharerPersonId = personId;
            access.Token = emergencyTokenGenerator.Generate();
            access.AccessGrantedTimestamp = DateTime.UtcNow;
            await emergencyAccessStore.StoreAsync(access);
            return Ok(access);
        }


        [HttpPost("{accessType}/{accessId}/revoke")]
        public async Task<IActionResult> RevokeAccess([FromRoute] SharedAccessType accessType, [FromRoute] string accessId)
        {
            var personId = ControllerHelpers.GetPersonId(httpContextAccessor);
            switch (accessType)
            {
                case SharedAccessType.Unknown:
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

        private Func<ISharedAccess, object> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "type" => x => x.Type,
                "receiver" => x => x.AccessReceiverAccountId,
                "starttime" => x => x.AccessGrantedTimestamp,
                "endtime" => x => x.AccessEndTimestamp ?? DateTime.MaxValue,
                _ => x => x.AccessGrantedTimestamp
            };
        }

        private bool CanModifyAccess(ISharedAccess access, string personId)
        {
            return access.SharerPersonId == personId;
        }
    }
}
