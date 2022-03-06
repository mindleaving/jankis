using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Medication;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    public class MedicationSchedulesController : RestControllerBase<MedicationSchedule>
    {
        public MedicationSchedulesController(IStore<MedicationSchedule> store,
            IHttpContextAccessor httpContextAccessor)
            : base(store, httpContextAccessor)
        {
        }

        [HttpPut("{scheduleId}/items/{itemId}")]
        public async Task<IActionResult> AddMedication([FromRoute] string scheduleId, [FromRoute] string itemId, [FromBody] MedicationScheduleItem medication)
        {
            if (itemId != medication.Id)
                return BadRequest("ID of route doesn't match ID of body");
            var medicationSchedule = await store.GetByIdAsync(scheduleId);
            if (medicationSchedule == null)
                return NotFound();
            medicationSchedule.Items.Add(medication);
            await store.StoreAsync(medicationSchedule);
            return Ok();
        }

        [HttpDelete("{scheduleId}/items/{itemId}")]
        public async Task<IActionResult> RemoveMedication([FromRoute] string scheduleId, [FromRoute] string itemId)
        {
            var medicationSchedule = await store.GetByIdAsync(scheduleId);
            if (medicationSchedule == null)
                return NotFound();
            medicationSchedule.Items.RemoveAll(x => x.Id == itemId);
            await store.StoreAsync(medicationSchedule);
            return Ok();
        }

        protected override Task<object> TransformItem(MedicationSchedule item)
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

        protected override IEnumerable<MedicationSchedule> PrioritizeItems(
            List<MedicationSchedule> items,
            string searchText)
        {
            return items;
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
