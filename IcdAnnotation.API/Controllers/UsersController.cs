using System.Threading.Tasks;
using IcdAnnotation.API.Data;
using IcdAnnotation.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace IcdAnnotation.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IStore<User> userStore;

        public UsersController(IStore<User> userStore)
        {
            this.userStore = userStore;
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var user = await userStore.GetByIdAsync(id);
            if (user == null)
                return NotFound();
            return Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Store(string id, User user)
        {
            if (id != user.Username)
                return BadRequest("URL doesn't match the ID in the body");
            await userStore.StoreAsync(user);
            return Ok();
        }
    }
}
