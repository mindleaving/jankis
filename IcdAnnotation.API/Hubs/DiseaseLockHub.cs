using System.Threading.Tasks;
using IcdAnnotation.API.Data;
using IcdAnnotation.API.Models.SignalRClients;
using Microsoft.AspNetCore.SignalR;

namespace IcdAnnotation.API.Hubs
{
    public class DiseaseLockHub : Hub<IDiseaseLockClient>
    {
        private readonly IDiseaseStore diseaseStore;

        public DiseaseLockHub(IDiseaseStore diseaseStore)
        {
            this.diseaseStore = diseaseStore;
        }

        public async Task SubscribeToDisease(string icdCode)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, icdCode);
            var existingLock = await diseaseStore.GetLock(icdCode);
            if (existingLock != null)
                await Clients.Caller.ReceiveLock(existingLock);
        }

        public Task UnsubscribeFromDisease(string icdCode)
        {
            return Groups.RemoveFromGroupAsync(Context.ConnectionId, icdCode);
        }
    }
}
