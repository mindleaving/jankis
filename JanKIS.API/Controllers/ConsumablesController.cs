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
    public class ConsumablesController : ControllerBase
    {
        private readonly IStore<Consumable> consumablesStore;

        public ConsumablesController(IStore<Consumable> consumablesStore)
        {
            this.consumablesStore = consumablesStore;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] string id)
        {
            var consumable = await consumablesStore.GetByIdAsync(id);
            if (consumable == null)
                return NotFound();
            return Ok(consumable);
        }

        [HttpGet]
        public async Task<IActionResult> GetMany([FromQuery] int? count = null, [FromQuery] int? skip = null, [FromQuery] string orderBy = null)
        {
            Expression<Func<Consumable, object>> orderByExpression = orderBy?.ToLower() switch
            {
                "id" => x => x.Id,
                "name" => x => x.Name,
                _ => x => x.Name
            };
            var items = await consumablesStore.GetMany(count, skip, orderByExpression);
            return Ok(items);
        }


        [HttpGet(nameof(Search))]
        public async Task<IActionResult> Search([FromQuery] string searchText, [FromQuery] int? count = null, [FromQuery] int? skip = null)
        {
            var searchTerms = SearchTermSplitter.SplitAndToLower(searchText);
            var searchExpression = SearchExpressionBuilder.ContainsAll<Consumable>(x => x.Name.ToLower(), searchTerms);
            var items = await consumablesStore.SearchAsync(searchExpression, count, skip);
            var prioritizedItems = items.OrderBy(x => x.Name.Length);
            return Ok(prioritizedItems);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> CreateOrUpdate([FromRoute] string id, [FromBody] Consumable consumable)
        {
            if (consumable == null)
                return BadRequest("Missing body");
            if (id != consumable.Id)
                return BadRequest("ID from route doesn't match ID in body");
            await consumablesStore.StoreAsync(consumable);
            return Ok(consumable.Id);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] string id)
        {
            await consumablesStore.DeleteAsync(id);
            return Ok();
        }


    }
}
