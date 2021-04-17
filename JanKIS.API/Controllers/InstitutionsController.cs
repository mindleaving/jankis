using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    public class InstitutionsController : RestControllerBase<Institution>
    {
        private readonly IReadonlyStore<BedOccupancy> bedOccupanciesStore;

        public InstitutionsController(
            IStore<Institution> store,
            IReadonlyStore<BedOccupancy> bedOccupanciesStore)
            : base(store)
        {
            this.bedOccupanciesStore = bedOccupanciesStore;
        }

        [HttpGet("{institutionId}/bedoccupancies")]
        public async Task<IActionResult> GetBedOccupancies([FromRoute] string institutionId)
        {
            var institution = await store.GetByIdAsync(institutionId);
            if (institution == null)
                return NotFound();
            var departmentIds = institution.Departments.Select(x => x.Id).ToList();
            var bedOccupancies = await bedOccupanciesStore.SearchAsync(x => departmentIds.Contains(x.DepartmentId));
            return Ok(bedOccupancies);
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
