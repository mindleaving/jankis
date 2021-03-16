using System;
using System.Threading.Tasks;
using JanKIS.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        [HttpPost(nameof(RegisterNew))]
        public async Task<IActionResult> RegisterNew(ServiceDefinition serviceDefinition)
        {
            throw new NotImplementedException();
        }

        [HttpPost("{serviceId}/request")]
        public async Task<IActionResult> RequestService([FromRoute] string serviceId, [FromBody] ServiceRequest request)
        {
            throw new NotImplementedException();
        }


    }
}
