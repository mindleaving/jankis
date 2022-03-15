using System.Threading.Tasks;
using HealthModels.AccessControl;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace HealthSharingPortal.API.Hubs
{
    [Authorize]
    public class AccessRequestHub : Hub<IAccessRequestHubClient>
    {
        public const string Route = "/hubs/accessrequests";
    }

    public interface IAccessRequestHubClient
    {
        Task ReceiveAccessRequest(IAccessRequest accessRequest);
    }
}
