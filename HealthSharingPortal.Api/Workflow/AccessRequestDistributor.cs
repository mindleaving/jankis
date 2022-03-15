using System.Threading.Tasks;
using HealthModels;
using HealthModels.AccessControl;
using HealthSharingPortal.API.Hubs;
using HealthSharingPortal.API.Storage;
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
        private readonly IReadonlyStore<Person> personsStore;

        public AccessRequestDistributor(
            IHubContext<AccessRequestHub, IAccessRequestHubClient> accessRequestHub, 
            IReadonlyStore<Person> personsStore)
        {
            this.accessRequestHub = accessRequestHub;
            this.personsStore = personsStore;
        }

        public async Task NotifyNewHealthProfessionalAccessRequest(HealthProfessionalAccessRequest accessRequest)
        {
            await accessRequestHub.Clients.User(accessRequest.RequesterId).ReceiveAccessRequest(accessRequest);
        }
    }
}
