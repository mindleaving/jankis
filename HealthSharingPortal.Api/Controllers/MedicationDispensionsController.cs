using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
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
    public class MedicationDispensionsController : HealthRecordEntryControllerBase<MedicationDispension>
    {
        private readonly INotificationDistributor notificationDistributor;
        private readonly IPersonDataStore<MedicationSchedule> medicationScheduleStore;

        public MedicationDispensionsController(
            IPersonDataStore<MedicationDispension> store,
            IHttpContextAccessor httpContextAccessor,
            IAuthorizationModule authorizationModule,
            IReadonlyStore<PersonDataChange> changeStore,
            INotificationDistributor notificationDistributor,
            IPersonDataStore<MedicationSchedule> medicationScheduleStore)
            : base(store, httpContextAccessor, authorizationModule, changeStore)
        {
            this.notificationDistributor = notificationDistributor;
            this.medicationScheduleStore = medicationScheduleStore;
        }

        public override async Task<IActionResult> CreateOrReplace(string id, MedicationDispension item)
        {
            var username = ControllerHelpers.GetAccountId(httpContextAccessor);
            item.CreatedBy = username;
            return await base.CreateOrReplace(id, item);
        }

        [HttpPost("pastmedication")]
        public async Task<IActionResult> AddPastMedication([FromBody] PastMedicationViewModel body)
        {
            var accountId = ControllerHelpers.GetAccountId(httpContextAccessor);
            body.CreatedBy = accountId;

            var dispensionBuilder = new PastMedicationDispensionsBuilder();
            var medicationDispensions = dispensionBuilder.Build(body);
            var accessGrants = await GetAccessGrants();
            foreach (var dispension in medicationDispensions)
            {
                await Store(store, dispension, accessGrants);
            }
            return Ok();
        }

        [HttpPost("{dispensionId}/back-to-schedule")]
        public async Task<IActionResult> MoveDispensionBackToSchedule(
            [FromRoute] string dispensionId)
        {
            var accessGrants = await GetAccessGrants();
            var dispension = await store.GetByIdAsync(dispensionId, accessGrants);
            if (dispension == null)
                return NotFound($"Dispension '{dispensionId}' not found");
            if ((dispension.Timestamp - DateTime.UtcNow).Duration() > TimeSpan.FromDays(1))
                return BadRequest("Dispensions can only be moved back to schedule within 24 hours of the original schedule time");
            var activeSchedule = await medicationScheduleStore.FirstOrDefaultAsync(dispension.PersonId, x => x.IsActive, accessGrants);
            if (activeSchedule == null)
            {
                activeSchedule = new MedicationSchedule(dispension.PersonId)
                {
                    IsActive = true
                };
            }

            var matchingItem = activeSchedule.Items.FirstOrDefault(x => x.Drug.Id == dispension.Drug.Id);
            if(matchingItem == null)
            {
                matchingItem = new MedicationScheduleItem(dispension.Drug);
                activeSchedule.Items.Add(matchingItem);
            }
            dispension.State = MedicationDispensionState.Scheduled;
            matchingItem.PlannedDispensions.Add(dispension);
            await PersonDataControllerHelpers.Store(
                medicationScheduleStore,
                activeSchedule,
                accessGrants,
                httpContextAccessor);
            await Delete(store, dispension.Id, accessGrants);

            return Ok(matchingItem);
        }



        protected override Task<object> TransformItem(
            MedicationDispension item,
            Language language = Language.en)
        {
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<MedicationDispension, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "patient" => x => x.PersonId,
                "drug" => x => x.Drug.ProductName,
                "time" => x => x.Timestamp,
                _ => x => x.Timestamp
            };
        }

        protected override Expression<Func<MedicationDispension, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<MedicationDispension>(x => x.Drug.ProductName.ToLower(), searchTerms);
        }

        protected override Task PublishChange(
            MedicationDispension item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            return notificationDistributor.NotifyNewPatientEvent(item, storageOperation, submitterUsername);
        }
    }
}
