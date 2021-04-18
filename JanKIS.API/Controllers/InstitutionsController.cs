using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using JanKIS.API.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    public class InstitutionsController : RestControllerBase<Institution>
    {
        private readonly IStore<Room> roomsStore;
        private readonly IStore<Department> departmentsStore;
        private readonly IReadonlyStore<BedOccupancy> bedOccupanciesStore;

        public InstitutionsController(
            IStore<Institution> store,
            IStore<Room> roomsStore,
            IStore<Department> departmentsStore,
            IReadonlyStore<BedOccupancy> bedOccupanciesStore)
            : base(store)
        {
            this.roomsStore = roomsStore;
            this.departmentsStore = departmentsStore;
            this.bedOccupanciesStore = bedOccupanciesStore;
        }

        [HttpGet("{institutionId}/viewmodel")]
        public async Task<IActionResult> GetViewModel([FromRoute] string institutionId)
        {
            var institution = await store.GetByIdAsync(institutionId);
            if (institution == null)
                return NotFound();
            var rooms = await roomsStore.SearchAsync(x => institution.RoomIds.Contains(x.Id));
            var departments = await departmentsStore.SearchAsync(x => x.InstitutionId == institutionId);
            var viewModel = new InstitutionViewModel(
                institution.Id,
                institution.Name,
                rooms.OrderBy(x => x.Name).ToList(),
                departments.OrderBy(x => x.Name).ToList());
            return Ok(viewModel);
        }

        [HttpGet("{institutionId}/bedoccupancies")]
        public async Task<IActionResult> GetBedOccupancies([FromRoute] string institutionId)
        {
            var institution = await store.GetByIdAsync(institutionId);
            if (institution == null)
                return NotFound();
            var departmentIds = institution.DepartmentIds.ToList();
            var bedOccupancies = await bedOccupanciesStore.SearchAsync(x => departmentIds.Contains(x.DepartmentId));
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
            foreach (var department in viewModel.Departments)
            {
                await departmentsStore.StoreAsync(department);
                institution.DepartmentIds.Add(department.Id);
            }
            await store.StoreAsync(institution);
            return Ok();
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

        protected override IEnumerable<Institution> PrioritizeItems(
            List<Institution> items,
            string searchText)
        {
            return items.OrderBy(x => x.Name.Length);
        }
    }
}
