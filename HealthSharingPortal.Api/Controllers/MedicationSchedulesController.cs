using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Security;
using System.Threading.Tasks;
using HealthModels.Interview;
using HealthModels.Medication;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Storage;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    public class MedicationSchedulesController : PersonDataRestControllerBase<MedicationSchedule>
    {
        public MedicationSchedulesController(
            IPersonDataStore<MedicationSchedule> store,
            IHttpContextAccessor httpContextAccessor,
            IAuthorizationModule authorizationModule)
            : base(store, httpContextAccessor, authorizationModule)
        {
        }

        [HttpPut("{scheduleId}/items/{itemId}")]
        public async Task<IActionResult> AddMedication([FromRoute] string scheduleId, [FromRoute] string itemId, [FromBody] MedicationScheduleItem medication)
        {
            if (itemId != medication.Id)
                return BadRequest("ID of route doesn't match ID of body");
            var accessGrants = await GetAccessGrants();
            var medicationSchedule = await store.GetByIdAsync(scheduleId, accessGrants);
            if (medicationSchedule == null)
                return NotFound();
            medicationSchedule.Items.Add(medication);
            await store.StoreAsync(medicationSchedule, accessGrants);
            return Ok();
        }

        [HttpDelete("{scheduleId}/items/{itemId}")]
        public async Task<IActionResult> RemoveMedication([FromRoute] string scheduleId, [FromRoute] string itemId)
        {
            var accessGrants = await GetAccessGrants();
            var medicationSchedule = await store.GetByIdAsync(scheduleId, accessGrants);
            if (medicationSchedule == null)
                return NotFound();
            medicationSchedule.Items.RemoveAll(x => x.Id == itemId);
            await store.StoreAsync(medicationSchedule, accessGrants);
            return Ok();
        }

        protected override Task<object> TransformItem(
            MedicationSchedule item,
            Language language = Language.en)
        {
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<MedicationSchedule, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                _ => x => x.Id
            };
        }

        protected override Expression<Func<MedicationSchedule, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<MedicationSchedule>(x => x.Name.ToLower(), searchTerms);
        }

        protected override Task PublishChange(
            MedicationSchedule item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            // Nothing to do
            return Task.CompletedTask;
        }
    }
}
