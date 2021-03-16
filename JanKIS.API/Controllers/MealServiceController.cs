using System;
using System.Threading.Tasks;
using JanKIS.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MealServiceController : ControllerBase
    {
        [HttpGet("menu")]
        public async Task<IActionResult> GetMenu(DateTime? startDate = null, DateTime? endDate = null)
        {
            if(!startDate.HasValue)
                startDate = DateTime.Today;
            throw new NotImplementedException();
        }

        [HttpPost("menu/add")]
        public async Task<IActionResult> AddMealToMenu([FromBody] MealMenuItem menuItem)
        {
            throw new NotImplementedException();
        }

        [HttpPost("menu/remove/")]
        public async Task<IActionResult> RemoveMealFromMenu([FromBody] MealMenuItem menuItem)
        {
            throw new NotImplementedException();
        }


    }
}
