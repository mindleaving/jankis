using System.Threading.Tasks;
using HealthModels.AccessControl;
using HealthSharingPortal.API.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace HealthSharingPortal.API.Workflow
{
    public interface IAccessRequestDistributor
    {
        Task NotifyHealthProfessionalAboutNewHealthProfessionalAccessInvite(HealthProfessionalAccessInvite accessInvite);
        Task NotifyAccessGranted(HealthProfessionalAccess access);
    }

    public class AccessRequestDistributor : IAccessRequestDistributor
    {
        private readonly IHubContext<AccessRequestHub, IAccessRequestHubClient> accessRequestHub;

        public AccessRequestDistributor(
            IHubContext<AccessRequestHub, IAccessRequestHubClient> accessRequestHub)
        {
            this.accessRequestHub = accessRequestHub;
        }

        public async Task NotifyHealthProfessionalAboutNewHealthProfessionalAccessInvite(HealthProfessionalAccessInvite accessInvite)
        {
            await accessRequestHub.Clients.User(accessInvite.AccessReceiverUsername).ReceiveAccessInvite(accessInvite);
        }

        public async Task NotifyAccessGranted(HealthProfessionalAccess access)
        {
            await accessRequestHub.Clients.Users(access.AccessReceiverUsername, access.SharerPersonId).ReceiveGrantedAccess(access);
        }
    }
}
