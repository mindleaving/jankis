using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly IStore<ServiceDefinition> servicesStore;

        public ServicesController(IStore<ServiceDefinition> servicesStore)
        {
            this.servicesStore = servicesStore;
        }

        [HttpGet]
        public async Task<IActionResult> GetMany(int? count = null, int? skip = null, string orderBy = null)
        {
            Expression<Func<ServiceDefinition, object>> orderByExpression = orderBy?.ToLower() switch
            {
                "id" => x => x.Id,
                "name" => x => x.Name,
                "department" => x => x.DepartmentId,
                _ => x => x.Name
            };
            var items = await servicesStore.GetMany(count, skip, orderByExpression);
            return Ok(items);
        }

        [HttpGet(nameof(Search))]
        public async Task<IActionResult> Search([FromQuery] string searchText, [FromQuery] int? count = null, [FromQuery] int? skip = null)
        {
            var searchTerms = SearchTermSplitter.SplitAndToLower(searchText);
            var searchExpression = SearchExpressionBuilder.ContainsAll<ServiceDefinition>(x => x.Name.ToLower(), searchTerms);
            var items = await servicesStore.SearchAsync(searchExpression, count, skip);
            var prioritizedItems = items.OrderBy(x => x.Name.Length);
            return Ok(prioritizedItems);
        }


    }
}
