using System.Threading.Tasks;
using HealthModels.AccessControl;
using HealthSharingPortal.API.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace HealthSharingPortal.API.Workflow
{
    public interface IAccessRequestDistributor
    {
        Task NotifyNewHealthProfessionalAccessRequest(HealthProfessionalAccessRequest accessRequest);
    }

    public class AccessRequestDistributor : IAccessRequestDistributor
    {
        private readonly IHubContext<AccessRequestHub, IAccessRequestHubClient> accessRequestHub;

        public AccessRequestDistributor(
            IHubContext<AccessRequestHub, IAccessRequestHubClient> accessRequestHub)
        {
            this.accessRequestHub = accessRequestHub;
        }

        public async Task NotifyNewHealthProfessionalAccessRequest(HealthProfessionalAccessRequest accessRequest)
        {
            await accessRequestHub.Clients.User(accessRequest.RequesterId).ReceiveAccessRequest(accessRequest);
        }
    }
}
