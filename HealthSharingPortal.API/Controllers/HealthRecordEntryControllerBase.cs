using System;
using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    public abstract class HealthRecordEntryControllerBase<T> : PersonDataRestControllerBase<T> where T: class, IHealthRecordEntry
    {
        protected HealthRecordEntryControllerBase(
            IPersonDataStore<T> store,
            IHttpContextAccessor httpContextAccessor,
            IAuthorizationModule authorizationModule,
            IReadonlyStore<PersonDataChange> changeStore)
            : base(store, httpContextAccessor, authorizationModule, changeStore)
        {
        }

        public override async Task<IActionResult> CreateOrReplace(
            string id,
            T item)
        {
            item.CreatedBy = ControllerHelpers.GetAccountId(httpContextAccessor);
            return await base.CreateOrReplace(id, item);
        }

        [HttpPost("{entryId}/verified")]
        public async Task<IActionResult> MarkAsVerified([FromRoute] string entryId)
        {
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            if (accountType != AccountType.HealthProfessional)
                return Forbid("Only health professionals can verify health record entries");
            var accessGrants = await GetAccessGrants();
            var healthRecordEntry = await store.GetByIdAsync(entryId, accessGrants);
            if (healthRecordEntry == null)
                return NotFound();
            if (healthRecordEntry.IsVerified)
                return Ok();
            healthRecordEntry.IsVerified = true;
            await Store(store, healthRecordEntry, accessGrants);
            return Ok();
        }

        [HttpPost("{entryId}/seen")]
        public async Task<IActionResult> MarkAsSeen([FromRoute] string entryId)
        {
            var accountType = ControllerHelpers.GetAccountType(httpContextAccessor);
            if (accountType != AccountType.Sharer)
                return Forbid("Only the sharer owning the entry can mark it as seen");
            var accessGrants = await GetAccessGrants();
            var healthRecordEntry = await store.GetByIdAsync(entryId, accessGrants);
            if (healthRecordEntry == null)
                return NotFound();
            var personId = ControllerHelpers.GetPersonId(httpContextAccessor);
            if(healthRecordEntry.PersonId != personId)
                return Forbid("Only the sharer owning the entry can mark it as seen");
            if (healthRecordEntry.HasBeenSeenBySharer)
                return Ok();
            healthRecordEntry.HasBeenSeenBySharer = true;
            await Store(store, healthRecordEntry, accessGrants);
            return Ok();
        }
    }
}
