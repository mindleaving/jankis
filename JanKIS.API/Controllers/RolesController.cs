using System.Linq;
using System.Threading.Tasks;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolesController : ControllerBase
    {
        private readonly IStore<Role> rolesStore;
        private readonly IEmployeesStore employeesStore;

        public RolesController(
            IStore<Role> rolesStore,
            IEmployeesStore employeesStore)
        {
            this.rolesStore = rolesStore;
            this.employeesStore = employeesStore;
        }

        [HttpGet(nameof(Search))]
        public async Task<IActionResult> Search(string searchText, int? count = null)
        {
            var searchTerms = SearchTermSplitter.SplitAndToLower(searchText);
            var searchExpression = SearchExpressionBuilder.ContainsAll<Role>(x => x.Name.ToLower(), searchTerms);
            var items = await rolesStore.SearchAsync(searchExpression, count);
            var prioritizedItems = items
                .OrderBy(x => x.Name.ToLower().StartsWith(searchText.ToLower()))
                .ThenBy(x => x.Name.Length);
            return Ok(prioritizedItems);
        }


        [HttpPost]
        public async Task<IActionResult> CreateRole([FromBody] Role role)
        {
            if (await rolesStore.ExistsAsync(role.Id))
                return Conflict();
            await rolesStore.StoreAsync(role);
            return Ok();
        }

        [HttpPut("{roleName}")]
        public async Task<IActionResult> UpdateRole([FromRoute] string roleName, [FromBody] Role role)
        {
            if (role.Name != roleName)
                return BadRequest("Name of role in body doesn't match route");
            await rolesStore.StoreAsync(role);
            return Ok();
        }

        [HttpDelete("{roleName}")]
        public async Task<IActionResult> DeleteRole([FromRoute] string roleName)
        {
            await employeesStore.RemoveRoleFromAllUsers(roleName);
            await rolesStore.DeleteAsync(roleName);
            return Ok();
        }


    }
}
