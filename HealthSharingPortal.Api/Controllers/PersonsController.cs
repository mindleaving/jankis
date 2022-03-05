using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.Api.Helpers;
using HealthSharingPortal.Api.Storage;
using Microsoft.AspNetCore.Http;

namespace HealthSharingPortal.Api.Controllers
{
    public class PersonsController : RestControllerBase<Person>
    {
        public PersonsController(
            IStore<Person> store,
            IHttpContextAccessor httpContextAccessor)
            : base(store, httpContextAccessor)
        {
        }

        protected override Task<object> TransformItem(Person item)
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

        protected override IEnumerable<Person> PrioritizeItems(
            List<Person> items,
            string searchText)
        {
            return items.OrderBy(x => x.Id);
        }
    }
}
