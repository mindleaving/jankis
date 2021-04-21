using System.Threading.Tasks;
using JanKIS.API.Models.Subscriptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace JanKIS.API.Hubs
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
