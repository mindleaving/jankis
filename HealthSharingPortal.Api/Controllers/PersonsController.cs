using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Interview;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Helpers;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.Storage;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthSharingPortal.API.Controllers
{
    public class PersonsController : PersonDataRestControllerBase<Person>
    {
        private readonly IPersonStore store;

        public PersonsController(
            IPersonStore store,
            IHttpContextAccessor httpContextAccessor,
            IAuthorizationModule authorizationModule,
            IReadonlyStore<PersonDataChange> changeStore)
            : base(store, httpContextAccessor, authorizationModule, changeStore)
        {
            this.store = store;
        }

        [HttpGet]
        [HttpGet("search")]
        public override async Task<IActionResult> GetMany(
            string searchText,
            int? count = null,
            int? skip = null,
            string orderBy = null,
            OrderDirection orderDirection = OrderDirection.Ascending,
            Language language = Language.en)
        {
            Expression<Func<Person, bool>> searchExpression;
            if(!string.IsNullOrWhiteSpace(searchText))
            {
                var searchTerms = SearchTermSplitter.SplitAndToLower(searchText);
                searchExpression = BuildSearchExpression(searchTerms);
            }
            else
            {
                searchExpression = x => true;
            }
            var accessGrants = await GetAccessGrants();
            var orderExpression = BuildOrderByExpression(orderBy);
            var items = await store.SearchAsync(
                searchExpression,
                accessGrants,
                count,
                skip,
                orderExpression,
                orderDirection);
            return Ok(items);
        }

        protected override Task<object> TransformItem(
            Person item,
            Language language = Language.en)
        {
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<Person, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "id" => x => x.Id,
                "firstname" => x => x.FirstName,
                "lastname" => x => x.LastName,
                "birthdate" => x => x.BirthDate,
                "insurer" => x => x.HealthInsurance.InsurerName,
                _ => x => x.Id
            };
        }

        protected override Expression<Func<Person, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.Or(
                SearchExpressionBuilder.ContainsAny<Person>(x => x.Id.ToLower(), searchTerms),
                SearchExpressionBuilder.ContainsAny<Person>(x => x.FirstName.ToLower(), searchTerms),
                SearchExpressionBuilder.ContainsAny<Person>(x => x.LastName.ToLower(), searchTerms));
        }

        protected override Task PublishChange(
            Person item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            // Nothing to do
            return Task.CompletedTask;
        }
    }
}
