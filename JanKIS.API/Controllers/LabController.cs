using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LabController : ControllerBase
    {
        [HttpPost(nameof(RequestAnalysis))]
        public async Task<IActionResult> RequestAnalysis()
        {
            throw new NotImplementedException();
        }

        [HttpPut("{requestId}/results")]
        public async Task<IActionResult> SubmitResults([FromRoute] string requestId)
        {
            throw new NotImplementedException();
        }

        [HttpGet("{requestId}/results")]
        public async Task<IActionResult> GetResults([FromRoute] string requestId)
        {
            throw new NotImplementedException();
        }

    }
}
