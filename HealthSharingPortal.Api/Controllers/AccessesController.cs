using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Threading.Tasks;
using HealthModels.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Models.Filters;
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
        [HttpGet("search")]
        public async Task<IActionResult> GetAccesses(
            string searchText = null,
            bool onlyActive = false,
            DateTime? startTime = null,
            DateTime? endTime = null,
            int? count = null,
            int? skip = null,
            string orderBy = null,
            OrderDirection orderDirection = OrderDirection.Ascending)
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
                var username = ControllerHelpers.GetUsername(httpContextAccessor);
                var healthProfessionalAccesses = await healthProfessionalAccessStore.SearchAsync(x => x.AccessReceiverUsername == username);
                filteredAccesses = accessFilterer.FilterAccesses(healthProfessionalAccesses, filter);
            }
            else
            {
                filteredAccesses = Enumerable.Empty<ISharedAccess>();
            }

            if (skip.HasValue)
                filteredAccesses = filteredAccesses.Skip(skip.Value);
            if (count.HasValue)
                filteredAccesses = filteredAccesses.Take(count.Value);
            var orderExpression = BuildOrderByExpression(orderBy);
            filteredAccesses = orderDirection == OrderDirection.Ascending
                ? filteredAccesses.OrderBy(orderExpression)
                : filteredAccesses.OrderByDescending(orderExpression);

            return Ok(filteredAccesses);
        }

        private Func<ISharedAccess, object> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "type" => x => x.Type,
                "receiver" => x => x.AccessReceiverUsername,
                "starttime" => x => x.AccessGrantedTimestamp,
                _ => x => x.AccessGrantedTimestamp
            };
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
