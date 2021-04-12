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
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class WardsController : RestControllerBase<Ward>
    {
        public WardsController(IStore<Ward> store)
            : base(store)
        {
        }

        [HttpGet("{wardId}/rooms")]
        public async Task<IActionResult> ListRooms([FromRoute] string wardId)
        {
            throw new NotImplementedException();
        }

        [HttpGet("{wardId}/rooms/{roomId}/beds")]
        public async Task<IActionResult> ListBeds([FromRoute] string wardId, [FromRoute] string roomId)
        {
            throw new NotImplementedException();
        }

        [HttpGet("{wardId}/rooms/{roomId}/beds/{bedIndex}")]
        public async Task<IActionResult> GetBed([FromRoute] string wardId, [FromRoute] string roomId, [FromRoute] int bedIndex)
        {
            throw new NotImplementedException();
        }

        [HttpPatch("{wardId}/rooms/{roomId}/beds/{bedIndex}/clear")]
        public async Task<IActionResult> ClearBed([FromRoute] string wardId, [FromRoute] string roomId, [FromRoute] int bedIndex)
        {
            throw new NotImplementedException();
        }

        protected override Expression<Func<Ward, object>> BuildOrderByExpression(string orderBy)
        {
            return orderBy?.ToLower() switch
            {
                "id" => x => x.Id,
                "name" => x => x.Name,
                _ => x => x.Id
            };
        }

        protected override Expression<Func<Ward, bool>> BuildSearchExpression(string[] searchTerms)
        {
            return SearchExpressionBuilder.ContainsAll<Ward>(x => x.Name.ToLower(), searchTerms);
        }

        protected override IEnumerable<Ward> PrioritizeItems(
            List<Ward> items,
            string searchText)
        {
            return items.OrderBy(x => x.Name.Length);
        }
    }
}
