using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels.Interview;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RolesController : RestControllerBase<Role>
    {
        private readonly IStore<Role> rolesStore;
        private readonly IAccountStore accountsStore;

        public RolesController(
            IStore<Role> rolesStore,
            IAccountStore accountsStore,
            IHttpContextAccessor httpContextAccessor)
            : base(rolesStore, httpContextAccessor)
        {
            this.rolesStore = rolesStore;
            this.accountsStore = accountsStore;
        }

        public override async Task<IActionResult> Delete(string id)
        {
            var role = await rolesStore.GetByIdAsync(id);
            if (role == null)
                return Ok();
            if (role.IsSystemRole)
                return Forbid("System-roles cannot be deleted");
            await accountsStore.RemoveRoleFromAllUsers(id);
            return await base.Delete(id);
        }


        protected override Task<object> TransformItem(
            Role item,
            Language language = Language.en)
        {
            return Task.FromResult<object>(item);
        }

        protected override Expression<Func<Role, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "id" => x => x.Id,
                "name" => x => x.Name,
                _ => x => x.Id
            };
        }

        protected override Expression<Func<Role, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<Role>(x => x.Name.ToLower(), searchTerms);
        }

        protected override IEnumerable<Role> PrioritizeItems(List<Role> items, string searchText)
        {
            return items
                .OrderBy(x => x.Name.ToLower().StartsWith(searchText.ToLower()))
                .ThenBy(x => x.Name.Length);
        }

        protected override Task PublishChange(
            Role item,
            StorageOperation storageOperation,
            string submitterUsername)
        {
            // Nothing to do
            return Task.CompletedTask;
        }
    }
}
