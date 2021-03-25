using System;
using System.Threading.Tasks;
using JanKIS.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PharmacyController : ControllerBase
    {
        [HttpGet("drugs/search")]
        public async Task<IActionResult> SearchDrug([FromQuery] string searchText)
        {
            throw new NotImplementedException();
        }

        [HttpPost("drugs/add")]
        public async Task<IActionResult> AddDrug([FromBody] Drug drug)
        {
            throw new NotImplementedException();
        }

        [HttpPut("drugs/{drugId}")]
        public async Task<IActionResult> UpdateDrug([FromRoute] string drugId, [FromBody] Drug drug)
        {
            throw new NotImplementedException();
        }

        [HttpGet("drugs/{drugId}")]
        public async Task<IActionResult> ViewDrugInfo([FromRoute] string drugId)
        {
            throw new NotImplementedException();
        }

        [HttpPost("drugs/{drugId}/order")]
        public async Task<IActionResult> OrderDrug([FromRoute] string drugId, [FromBody] DrugOrder order)
        {
            throw new NotImplementedException();
        }

        [HttpGet("orders/{orderId}")]
        public async Task<IActionResult> ViewOrder([FromRoute] string orderId)
        {
            throw new NotImplementedException();
        }

        [HttpDelete("orders/{orderId}")]
        public async Task<IActionResult> DeleteOrder([FromRoute] string orderId)
        {
            throw new NotImplementedException();
        }

    }
}
