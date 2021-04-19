using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    public class ResourcesController : RestControllerBase<Resource>
    {
        public ResourcesController(IStore<Resource> store)
            : base(store)
        {
        }

        [Authorize(Policy = nameof(Permission.ViewResources))]
        public override Task<IActionResult> GetById(string id)
        {
            return base.GetById(id);
        }

        [Authorize(Policy = nameof(Permission.ViewResources))]
        public override Task<IActionResult> GetMany(
            int? count = null,
            int? skip = null,
            string orderBy = null,
            OrderDirection orderDirection = OrderDirection.Ascending)
        {
            return base.GetMany(
                count,
                skip,
                orderBy,
                orderDirection);
        }

        [Authorize(Policy = nameof(Permission.ViewResources))]
        public override Task<IActionResult> Search(
            string searchText,
            int? count = null,
            int? skip = null)
        {
            return base.Search(
                searchText,
                count,
                skip);
        }

        [Authorize(Policy = nameof(Permission.ModifyResources))]
        public override Task<IActionResult> CreateOrReplace(
            string id,
            Resource item)
        {
            return base.CreateOrReplace(id, item);
        }

        [Authorize(Policy = nameof(Permission.ModifyResources))]
        public override Task<IActionResult> Delete(string id)
        {
            return base.Delete(id);
        }

        protected override Expression<Func<Resource, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "id" => x => x.Id,
                "name" => x => x.Name,
                _ => x => x.Name
            };
        }

        protected override Expression<Func<Resource, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<Resource>(x => x.Name.ToLower(), searchTerms);
        }

        protected override IEnumerable<Resource> PrioritizeItems(
            List<Resource> items,
            string searchText)
        {
            return items.OrderBy(x => x.Name.Length);
        }
    }
}