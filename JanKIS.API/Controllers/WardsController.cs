using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WardsController : ControllerBase
    {
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
    }
}
