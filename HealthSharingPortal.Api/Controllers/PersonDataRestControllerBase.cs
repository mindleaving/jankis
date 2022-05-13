using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Interview;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public abstract class PersonDataRestControllerBase<T> : ControllerBase, IRestController<T> where T : class, IPersonData
    {
        protected readonly IPersonDataStore<T> store;
        protected readonly IReadonlyStore<PersonDataChange> changeStore;
        protected readonly IHttpContextAccessor httpContextAccessor;
        protected readonly IAuthorizationModule authorizationModule;

        protected PersonDataRestControllerBase(
            IPersonDataStore<T> store,
            IHttpContextAccessor httpContextAccessor,
            IAuthorizationModule authorizationModule,
            IReadonlyStore<PersonDataChange> changeStore)
        {
            this.store = store;
            this.httpContextAccessor = httpContextAccessor;
            this.authorizationModule = authorizationModule;
            this.changeStore = changeStore;
        }

        [HttpGet("{id}")]
        public virtual async Task<IActionResult> GetById(
            [FromRoute] string id,
            [FromQuery] Language language = Language.en)
        {
            var accessGrants = await GetAccessGrants();
            var item = await store.GetByIdAsync(id, accessGrants);
            if (item == null)
                return NotFound();
            var transformedItem = await TransformItem(item, language);
            return Ok(transformedItem);
        }

        [HttpGet]
        [HttpGet("search")]
        public virtual Task<IActionResult> GetMany(
            string searchText,
            int? count = null,
            int? skip = null,
            string orderBy = null,
            OrderDirection orderDirection = OrderDirection.Ascending,
            Language language = Language.en)
        {
            throw new NotSupportedException("Use GetMany with mandatory personId-parameter");
        }

        [HttpGet("/api/persons/{personId}/[controller]")]
        public virtual async Task<IActionResult> GetMany(
            [FromRoute] string personId,
            [FromQuery] string searchText, 
            [FromQuery] int? count = null,
            [FromQuery] int? skip = null,
            [FromQuery] string orderBy = null,
            [FromQuery] OrderDirection orderDirection = OrderDirection.Ascending,
            [FromQuery] Language language = Language.en)
        {
            if (string.IsNullOrWhiteSpace(personId))
                return BadRequest("No person ID specified");
            var accessGrants = await GetAccessGrants();
            Expression<Func<T, bool>> searchExpression;
            if(!string.IsNullOrWhiteSpace(searchText))
            {
                var searchTerms = SearchTermSplitter.SplitAndToLower(searchText);
                searchExpression = BuildSearchExpression(searchTerms);
            }
            else
            {
                searchExpression = x => true;
            }
            var orderByExpression = BuildOrderByExpression(orderBy);
            var items = await store.SearchAsync(personId, searchExpression, accessGrants, count, skip, orderByExpression, orderDirection);
            var transformedItems = await TransformItems(items, language);
            return Ok(transformedItems);
        }

        [HttpGet("{id}/history")]
        public async Task<IActionResult> GetChangeHistory([FromRoute] string id)
        {
            var changes = await changeStore.SearchAsync(x => x.Type == typeof(T).Name && x.EntryId == id);
            return Ok(changes);
        }


        [HttpPost]
        [HttpPut("{id}")]
        public virtual async Task<IActionResult> CreateOrReplace([FromRoute] string id, [FromBody] T item)
        {
            if (id != null && id != item.Id)
                return BadRequest("ID of route doesn't match body");
            var username = ControllerHelpers.GetAccountId(httpContextAccessor);
            var accessGrants = await GetAccessGrants();
            var storageOperation = await Store(store, item, accessGrants);
            await PublishChange(item, storageOperation, username);
            return Ok(id);
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> PartialUpdate([FromRoute] string id, [FromBody] JsonPatchDocument<T> updates)
        {
            var accessGrants = await GetAccessGrants();
            var item = await store.GetByIdAsync(id, accessGrants);
            if (item == null)
                return NotFound();
            updates.ApplyTo(item, ModelState);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            if (item.Id != id)
                return BadRequest("ID of the item must not be changed");
            await Store(store, item, accessGrants);
            var username = ControllerHelpers.GetAccountId(httpContextAccessor);
            await PublishChange(item, StorageOperation.Changed, username);
            return Ok();
        }


        [HttpDelete("{id}")]
        public virtual async Task<IActionResult> Delete([FromRoute] string id)
        {
            var accessGrants = await GetAccessGrants();
            await Delete(store, id, accessGrants);
            return Ok();
        }

        protected Task<StorageOperation> Store(
            IPersonDataStore<T> personDataStore,
            T item,
            List<IPersonDataAccessGrant> accessGrants)
        {
            return PersonDataControllerHelpers.Store(personDataStore, item, accessGrants, httpContextAccessor);
        }

        protected Task Delete(
            IPersonDataStore<T> personDataStore,
            string id,
            List<IPersonDataAccessGrant> accessGrants)
        {
            return PersonDataControllerHelpers.Delete(personDataStore, id, accessGrants, httpContextAccessor);
        }

        protected async Task<List<IPersonDataAccessGrant>> GetAccessGrants()
        {
            var claims = ControllerHelpers.GetClaims(httpContextAccessor);
            return await authorizationModule.GetAccessGrants(claims);
        }

        private async Task<List<object>> TransformItems(IEnumerable<T> items, Language language)
        {
            var transformTasks = items.Select(item => TransformItem(item, language)).ToList();
            await Task.WhenAll(transformTasks);
            return transformTasks.Select(x => x.Result).ToList();
        }

        protected abstract Task<object> TransformItem(T item, Language language = Language.en);
        protected abstract Expression<Func<T, object>> BuildOrderByExpression(string orderBy);
        protected abstract Expression<Func<T,bool>> BuildSearchExpression(string[] searchTerms);
        protected abstract Task PublishChange(T item, StorageOperation storageOperation, string submitterUsername);
    }
}