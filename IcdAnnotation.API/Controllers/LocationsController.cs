using System.Linq;
using System.Threading.Tasks;
using HealthModels.Icd.Annotation.Epidemiology;
using IcdAnnotation.API.Data;
using IcdAnnotation.API.Helpers;
using IcdAnnotation.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace IcdAnnotation.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationsController : ControllerBase
    {
        private readonly IReadonlyStore<Location> locationsStore;

        public LocationsController(IReadonlyStore<Location> locationsStore)
        {
            this.locationsStore = locationsStore;
        }

        [HttpGet(nameof(Search))]
        public async Task<IActionResult> Search(string searchText, int? count = 30, int? skip = 0)
        {
            var searchTerms = searchText.Split().Select(str => str.ToLower()).ToArray();
            var searchExpression = SearchExpressionBuilder.ContainsAll<Location>(x => x.Name.ToLower(), searchTerms);
            var items = await locationsStore.SearchAsync(searchExpression, count, skip);
            var prioritizedItems = items.OrderBy(x => x.Name.Length);
            return Ok(prioritizedItems);
        }

    }
}
