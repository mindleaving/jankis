using System.Net;
using System.Threading.Tasks;
using IcdAnnotation.API.Data;
using IcdAnnotation.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace IcdAnnotation.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedbackController : ControllerBase
    {
        private readonly IStore<Feedback> feedbackStore;
        private readonly IOptions<FeedbackOptions> feedbackOptions;

        public FeedbackController(
            IStore<Feedback> feedbackStore,
            IOptions<FeedbackOptions> feedbackOptions)
        {
            this.feedbackStore = feedbackStore;
            this.feedbackOptions = feedbackOptions;
        }

        [HttpGet]
        public async Task<IActionResult> GetMany(string secret)
        {
            if (secret != feedbackOptions.Value.ReadSecret)
                return StatusCode((int) HttpStatusCode.Unauthorized);
            var items = await feedbackStore.GetAllAsync();
            return Ok(items);
        }

        [HttpPost]
        public async Task<IActionResult> Store(Feedback feedback)
        {
            await feedbackStore.StoreAsync(feedback);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id, string secret)
        {
            if (secret != feedbackOptions.Value.ReadSecret)
                return StatusCode((int) HttpStatusCode.Unauthorized);
            await feedbackStore.DeleteAsync(id);
            return Ok();
        }
    }
}
