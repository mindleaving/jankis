using System.Threading.Tasks;
using HealthSharingPortal.API.Models.Subscriptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace HealthSharingPortal.API.Hubs
{
    [Authorize]
    public class NotificationsHub : Hub<INotificationsClient>
    {
        public const string Route = "/hubs/notifications";
    }

    public interface INotificationsClient
    {
        Task ReceiveNotification(INotification notification);
    }
}
