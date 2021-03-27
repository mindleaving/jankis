using System;
using System.Collections.Generic;
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
    public abstract class RestControllerBase<T> : ControllerBase where T: IId
    {
        protected readonly IStore<T> store;

        protected RestControllerBase(IStore<T> store)
        {
            this.store = store;
        }

        [HttpGet("{id}")]
        public virtual async Task<IActionResult> GetById([FromRoute] string id)
        {
            var item = await store.GetByIdAsync(id);
            if (item == null)
                return NotFound();
            return Ok(item);
        }

        [HttpGet]
        public virtual async Task<IActionResult> GetMany([FromQuery] int? count = null, [FromQuery] int? skip = null, [FromQuery] string orderBy = null)
        {
            var orderByExpression = BuildOrderByExpression(orderBy);
            var items = await store.GetMany(count, skip, orderByExpression);
            return Ok(items);
        }

        [HttpGet(nameof(Search))]
        public virtual async Task<IActionResult> Search([FromQuery] string searchText, [FromQuery] int? count = null, [FromQuery] int? skip = null)
        {
            var searchTerms = SearchTermSplitter.SplitAndToLower(searchText);
            var searchExpression = BuildSearchExpression(searchTerms);
            var items = await store.SearchAsync(searchExpression, count, skip);
            var prioritizedItems = PrioritizeItems(items);
            return Ok(prioritizedItems);
        }

        [HttpPut("{id}")]
        public virtual async Task<IActionResult> CreateOrUpdate([FromRoute] string id, [FromBody] T item)
        {
            if (id != item.Id)
                return BadRequest("ID of route doesn't match body");
            await store.StoreAsync(item);
            return Ok(id);
        }

        [HttpDelete("{id}")]
        public virtual async Task<IActionResult> Delete([FromRoute] string id)
        {
            await store.DeleteAsync(id);
            return Ok();
        }

        protected abstract Expression<Func<T, object>> BuildOrderByExpression(string orderBy);
        protected abstract Expression<Func<T,bool>> BuildSearchExpression(string[] searchTerms);
        protected abstract IEnumerable<Resource> PrioritizeItems(List<T> items);
    }
}
