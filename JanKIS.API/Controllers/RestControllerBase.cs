using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Interview;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public abstract class RestControllerBase<T> : ControllerBase where T: class, IId
    {
        protected readonly IStore<T> store;
        protected readonly IHttpContextAccessor httpContextAccessor;

        protected RestControllerBase(
            IStore<T> store,
            IHttpContextAccessor httpContextAccessor)
        {
            this.store = store;
            this.httpContextAccessor = httpContextAccessor;
        }

        [HttpGet("{id}")]
        public virtual async Task<IActionResult> GetById([FromRoute] string id)
        {
            var item = await store.GetByIdAsync(id);
            if (item == null)
                return NotFound();
            var transformedItem = await TransformItem(item);
            return Ok(transformedItem);
        }

        [HttpGet]
        public virtual async Task<IActionResult> GetMany(
            [FromQuery] int? count = null,
            [FromQuery] int? skip = null,
            [FromQuery] string orderBy = null,
            [FromQuery] OrderDirection orderDirection = OrderDirection.Ascending)
        {
            var orderByExpression = BuildOrderByExpression(orderBy);
            var items = await store.GetMany(count, skip, orderByExpression, orderDirection);
            var transformedItems = await TransformItems(items);
            return Ok(transformedItems);
        }

        [HttpGet(nameof(Search))]
        public virtual async Task<IActionResult> Search([FromQuery] string searchText, [FromQuery] int? count = null, [FromQuery] int? skip = null)
        {
            if (searchText == null)
                return BadRequest("No search text specified");
            var searchTerms = SearchTermSplitter.SplitAndToLower(searchText);
            var searchExpression = BuildSearchExpression(searchTerms);
            var items = await store.SearchAsync(searchExpression, count, skip);
            var prioritizedItems = PrioritizeItems(items, searchText);
            var transformedItems = await TransformItems(prioritizedItems);
            return Ok(transformedItems);
        }

        [HttpPut("{id}")]
        public virtual async Task<IActionResult> CreateOrReplace([FromRoute] string id, [FromBody] T item)
        {
            if (id != item.Id)
                return BadRequest("ID of route doesn't match body");
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            var storageOperation = await store.StoreAsync(item);
            await PublishChange(item, storageOperation, username);
            return Ok(id);
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> PartialUpdate([FromRoute] string id, [FromBody] JsonPatchDocument<T> updates)
        {
            var item = await store.GetByIdAsync(id);
            if (item == null)
                return NotFound();
            updates.ApplyTo(item, ModelState);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            await store.StoreAsync(item);
            await PublishChange(item, StorageOperation.Changed, username);
            return Ok();
        }


        [HttpDelete("{id}")]
        public virtual async Task<IActionResult> Delete([FromRoute] string id)
        {
            await store.DeleteAsync(id);
            return Ok();
        }

        protected async Task<List<object>> TransformItems(IEnumerable<T> items)
        {
            var transformedItems = new List<object>();
            foreach (var item in items)
            {
                var transformedItem = await TransformItem(item);
                transformedItems.Add(transformedItem);
            }
            return transformedItems;
        }

        protected abstract Task<object> TransformItem(T item, Language language = Language.en);
        protected abstract Expression<Func<T, object>> BuildOrderByExpression(string orderBy);
        protected abstract Expression<Func<T,bool>> BuildSearchExpression(string[] searchTerms);
        protected abstract IEnumerable<T> PrioritizeItems(List<T> items, string searchText);
        protected abstract Task PublishChange(T item, StorageOperation storageOperation, string submitterUsername);
    }
}
