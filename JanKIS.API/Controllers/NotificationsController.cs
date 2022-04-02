using System.Threading.Tasks;
using HealthSharingPortal.API.Helpers;
using JanKIS.API.Helpers;
using JanKIS.API.Storage;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JanKIS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationsStore notificationsStore;
        private readonly IHttpContextAccessor httpContextAccessor;

        public NotificationsController(
            INotificationsStore notificationsStore,
            IHttpContextAccessor httpContextAccessor)
        {
            this.notificationsStore = notificationsStore;
            this.httpContextAccessor = httpContextAccessor;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllForUser(int? count = null, int? skip = null, bool includeDismissed = false)
        {
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            var notifications = await notificationsStore.GetAllForUser(username, count, skip, includeDismissed);
            return Ok(notifications);
        }

        [HttpPost("{notificationId}/dismiss")]
        public async Task<IActionResult> Dismiss([FromRoute] string notificationId)
        {
            var notification = await notificationsStore.GetByIdAsync(notificationId);
            if (notification == null)
                return NotFound();
            var username = ControllerHelpers.GetUsername(httpContextAccessor);
            if (notification.Subscription.Username != username)
                return Forbid();
            await notificationsStore.Dismiss(notificationId);
            return Ok();
        }
    }
}
