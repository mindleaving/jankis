using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Interview;
using HealthSharingPortal.API.Controllers;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.Workflow.ViewModelBuilders;
using JanKIS.API.Models;
using JanKIS.API.Models.Subscriptions;
using JanKIS.API.ViewModels;
using JanKIS.API.Workflow.ViewModelBuilders;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SearchExpressionBuilder = JanKIS.API.Helpers.SearchExpressionBuilder;

namespace JanKIS.API.Controllers
{
    public class InstitutionsController : RestControllerBase<Institution>
    {
        private readonly IStore<Room> roomsStore;
        private readonly IStore<Department> departmentsStore;
        private readonly IReadonlyStore<BedOccupancy> bedOccupanciesStore;
        private readonly Storage.ISubscriptionsStore subscriptionsStore;
        private readonly IViewModelBuilder<Institution> institutionViewModelBuilder;

        public InstitutionsController(
            IStore<Institution> store,
            IStore<Room> roomsStore,
            IStore<Department> departmentsStore,
            IReadonlyStore<BedOccupancy> bedOccupanciesStore,
            IHttpContextAccessor httpContextAccessor,
            Storage.ISubscriptionsStore subscriptionsStore,
            IViewModelBuilder<Institution> institutionViewModelBuilder)
            : base(store, httpContextAccessor)
        {
            this.roomsStore = roomsStore;
            this.departmentsStore = departmentsStore;
            this.bedOccupanciesStore = bedOccupanciesStore;
            this.subscriptionsStore = subscriptionsStore;
            this.institutionViewModelBuilder = institutionViewModelBuilder;
        }

        [HttpGet("{institutionId}/bedoccupancies")]
        public async Task<IActionResult> GetBedOccupancies([FromRoute] string institutionId)
        {
            var institution = await store.GetByIdAsync(institutionId);
            if (institution == null)
                return NotFound();
            var departmentIds = institution.DepartmentIds.ToList();
            var bedOccupancies = await bedOccupanciesStore.SearchAsync(x => departmentIds.Contains(x.Department.Id));
            return Ok(bedOccupancies);
        }

        [HttpPut("{institutionId}/storeviewmodel")]
        public async Task<IActionResult> StoreViewModel([FromRoute] string institutionId, [FromBody] InstitutionViewModel viewModel)
        {
            if (institutionId != viewModel.Id)
                return BadRequest("ID from route and body do not match");
            if (viewModel.Departments.Any(x => x.InstitutionId != institutionId))
                return BadRequest("One or more departments don't belong to this institution");
            var institution = new Institution(viewModel.Id, viewModel.Name);
            foreach (var room in viewModel.Rooms)
            {
                await roomsStore.StoreAsync(room);
                institution.RoomIds.Add(room.Id);
            }
            foreach (var departmentViewModel in viewModel.Departments)
            {
                var department = departmentViewModel.ToModel();
                await departmentsStore.StoreAsync(department);
                institution.DepartmentIds.Add(departmentViewModel.Id);
            }
            await store.StoreAsync(institution);
            return Ok();
        }

        [HttpPost("{institutionId}/subscribe")]
        public async Task<IActionResult> Subscribe([FromRoute] string institutionId)
        {
            var institution = await store.GetByIdAsync(institutionId);
            if (institution == null)
                return NotFound();
            var username = ControllerHelpers.GetAccountId(httpContextAccessor);
            var subscription = new InstitutionSubscription(
                Guid.NewGuid().ToString(),
                username,
                institutionId);
            await subscriptionsStore.StoreAsync(subscription);
            return Ok(subscription.Id);
        }

        [HttpPost("{institutionId}/unsubscribe")]
        public async Task<IActionResult> Unsubscribe([FromRoute] string institutionId)
        {
            var username = ControllerHelpers.GetAccountId(httpContextAccessor);
            var existingSubscription = await subscriptionsStore.GetInstitutionSubscription(institutionId, username);
            if (existingSubscription == null)
                return Ok();
            await subscriptionsStore.DeleteAsync(existingSubscription.Id);
            return Ok();
        }

        protected override async Task<object> TransformItem(
            Institution item,
            Language language = Language.en)
        {
            return await institutionViewModelBuilder.Build(item);
        }

        protected override Expression<Func<Institution, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "id" => x => x.Id,
                "name" => x => x.Name,
                _ => x => x.Name
            };
        }

        protected override Expression<Func<Institution, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<Institution>(x => x.Name.ToLower(), searchTerms);
        }

        protected override Task PublishChange(
            Institution item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            // Nothing to do
            return Task.CompletedTask;
        }
    }
}
