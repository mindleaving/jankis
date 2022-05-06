using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Commons.Extensions;
using HealthModels;
using HealthModels.Interview;
using HealthModels.Medication;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.ViewModels;
using HealthSharingPortal.API.Workflow;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    public class MedicationSchedulesController : PersonDataRestControllerBase<MedicationSchedule>
    {
        private readonly IPersonDataStore<MedicationDispension> dispensionsStore;
        private readonly MedicationDispensionsBuilder dispensionsBuilder;
        private readonly INotificationDistributor notificationDistributor;

        public MedicationSchedulesController(
            IPersonDataStore<MedicationSchedule> store,
            IHttpContextAccessor httpContextAccessor,
            IAuthorizationModule authorizationModule,
            IReadonlyStore<PersonDataChange> changeStore,
            IPersonDataStore<MedicationDispension> dispensionsStore,
            MedicationDispensionsBuilder dispensionsBuilder,
            INotificationDistributor notificationDistributor)
            : base(store, httpContextAccessor, authorizationModule, changeStore)
        {
            this.dispensionsStore = dispensionsStore;
            this.dispensionsBuilder = dispensionsBuilder;
            this.notificationDistributor = notificationDistributor;
        }

        [HttpPost("{scheduleId}/active")]
        public async Task<IActionResult> SetActive([FromRoute] string scheduleId)
        {
            var accessGrants = await GetAccessGrants();
            var schedule = await store.GetByIdAsync(scheduleId, accessGrants);
            if (schedule == null)
                return NotFound($"Schedule '{scheduleId}' not found");
            var currentlyActiveSchedules = await store.SearchAsync(schedule.PersonId, x => x.IsActive && x.Id != scheduleId, accessGrants);
            foreach (var currentlyActiveSchedule in currentlyActiveSchedules)
            {
                currentlyActiveSchedule.IsActive = false;
                await Store(store, currentlyActiveSchedule, accessGrants);
            }
            if (schedule.IsActive)
                return Ok();
            schedule.IsActive = true;
            await Store(store, schedule, accessGrants);
            return Ok();
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
            await Store(store, medicationSchedule, accessGrants);
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
            await Store(store, medicationSchedule, accessGrants);
            return Ok();
        }

        [HttpPost("{scheduleId}/items/{itemId}/dispensions")]
        [HttpPost("{scheduleId}/items/{itemId}/dispensions/{dispensionId}")]
        public async Task<IActionResult> AddDispension(
            [FromRoute] string scheduleId,
            [FromRoute] string itemId,
            [FromRoute] string dispensionId,
            [FromBody] MedicationDispension dispension)
        {
            if (dispensionId != null && dispensionId != dispension.Id)
                return BadRequest("ID in body doesn't match route");
            var accessGrants = await GetAccessGrants();
            var medicationSchedule = await store.GetByIdAsync(scheduleId, accessGrants);
            if (medicationSchedule == null)
                return NotFound();
            var matchingItem = medicationSchedule.Items.FirstOrDefault(x => x.Id == itemId);
            if (matchingItem == null)
            {
                matchingItem = new MedicationScheduleItem(dispension.Drug);
                medicationSchedule.Items.Add(matchingItem);
            }
            matchingItem.PlannedDispensions.RemoveAll(x => x.Id == dispension.Id);
            matchingItem.PlannedDispensions.Add(dispension);
            await Store(store, medicationSchedule, accessGrants);
            return Ok(matchingItem);
        }

        [HttpDelete("{scheduleId}/dispensions/{dispensionId}")]
        public async Task<IActionResult> RemoveDispension([FromRoute] string scheduleId, [FromRoute] string dispensionId)
        {
            var accessGrants = await GetAccessGrants();
            var medicationSchedule = await store.GetByIdAsync(scheduleId, accessGrants);
            if (medicationSchedule == null)
                return NotFound();
            foreach (var item in medicationSchedule.Items)
            {
                item.PlannedDispensions.RemoveAll(x => x.Id == dispensionId);
            }
            await Store(store, medicationSchedule, accessGrants);
            return Ok();
        }

        [HttpPost("copyitem")]
        public async Task<IActionResult> CopyScheduleItem([FromBody] CopyMedicationScheduleItemViewModel body)
        {
            var accessGrants = await GetAccessGrants();
            var sourceSchedule = await store.GetByIdAsync(body.SourceScheduleId, accessGrants);
            if (sourceSchedule == null)
                return NotFound($"Source schedule '{body.SourceScheduleId}' not found");
            var item = sourceSchedule.Items.FirstOrDefault(x => x.Id == body.ItemId);
            if (item == null)
                return NotFound($"Item '{body.ItemId}' not found in source schedule");
            var targetSchedule = await store.GetByIdAsync(body.TargetScheduleId, accessGrants);
            if (targetSchedule == null)
                return NotFound($"Target schedule '{body.TargetScheduleId}' not found");
            if (targetSchedule.Items.Exists(x => x.Id == item.Id))
                return Ok();
            targetSchedule.Items.Add(item);
            await Store(store, targetSchedule, accessGrants);
            return Ok();
        }

        [HttpPost("{scheduleId}/spawndispensions")]
        public async Task<IActionResult> SpawnDispensions(
            [FromRoute] string scheduleId,
            [FromQuery] DateTime endTime)
        {
            if (endTime - DateTime.UtcNow > TimeSpan.FromDays(31))
                return BadRequest("End time cannot be more than 31 days in the future");
            var accessGrants = await GetAccessGrants();
            var schedule = await store.GetByIdAsync(scheduleId, accessGrants);
            if (schedule == null)
                return NotFound($"Schedule '{scheduleId}' not found");

            var accountId = ControllerHelpers.GetAccountId(httpContextAccessor);
            foreach (var item in schedule.Items)
            {
                dispensionsBuilder.BuildForTimeRange(item, endTime, schedule.PersonId, accountId);
            }

            await Store(store, schedule, accessGrants);
            return Ok();
        }

        [HttpPost("{scheduleId}/items/{itemId}/spawndispensions")]
        public async Task<IActionResult> SpawnDispensions(
            [FromRoute] string scheduleId,
            [FromRoute] string itemId,
            [FromQuery] DateTime endTime)
        {
            if (endTime - DateTime.UtcNow > TimeSpan.FromDays(31))
                return BadRequest("End time cannot be more than 31 days in the future");
            var accessGrants = await GetAccessGrants();
            var schedule = await store.GetByIdAsync(scheduleId, accessGrants);
            if (schedule == null)
                return NotFound($"Schedule '{scheduleId}' not found");
            var item = schedule.Items.FirstOrDefault(x => x.Id == itemId);
            if (item == null)
                return NotFound($"Item '{itemId}' not found");

            var accountId = ControllerHelpers.GetAccountId(httpContextAccessor);
            dispensionsBuilder.BuildForTimeRange(item, endTime, schedule.PersonId, accountId);

            await Store(store, schedule, accessGrants);
            return Ok();
        }


        [HttpPost("dispense")]
        public async Task<IActionResult> DispenseMedication(
            [FromBody] DispenseMedicationViewModel body)
        {
            if (!body.DispensionState.InSet(MedicationDispensionState.Dispensed, MedicationDispensionState.Missed, MedicationDispensionState.Skipped))
                return BadRequest($"Dispension state cannot be '{body.DispensionState}'");
            var accessGrants = await GetAccessGrants();
            var schedule = await store.GetByIdAsync(body.ScheduleId, accessGrants);
            if (schedule == null)
                return NotFound($"Schedule '{body.ScheduleId}' not found");
            var item = schedule.Items.FirstOrDefault(x => x.Id == body.ItemId);
            if (item == null)
                return NotFound($"Item '{body.ItemId}' not found");
            var dispension = item.PlannedDispensions.FirstOrDefault(x => x.Id == body.DispensionId);
            if (dispension == null)
                return NotFound($"Dispension '{body.DispensionId}' not found");

            // Modify dispension
            dispension.State = body.DispensionState;
            var accountId = ControllerHelpers.GetAccountId(httpContextAccessor);
            dispension.CreatedBy = accountId;
            dispension.IsVerified = true;
            dispension.HasBeenSeenBySharer = true;
            dispension.Note = body.Note;
            if (body.DispensionState == MedicationDispensionState.Dispensed)
            {
                dispension.AdministeredBy = body.AdministeredBy ?? accountId;
                if(body.AdministrationTime.HasValue)
                    dispension.Timestamp = body.AdministrationTime.Value;
                if (body.AdministeredAmount != null)
                {
                    dispension.Value = body.AdministeredAmount.Value;
                    dispension.Unit = body.AdministeredAmount.Unit;
                }
            }

            await PersonDataControllerHelpers.Store(
                dispensionsStore,
                dispension,
                accessGrants,
                httpContextAccessor);
            item.PlannedDispensions.Remove(dispension);
            await Store(store, schedule, accessGrants);
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

        protected override async Task PublishChange(
            MedicationSchedule item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            await notificationDistributor.NotifyMedicationScheduleChanged(item, storageOperation, submitterUsername);
        }
    }
}
