using System.Threading.Tasks;
using HealthSharingPortal.API.Storage;
using JanKIS.API.Models;
using MongoDB.Driver;

namespace JanKIS.API.Storage
{
    public interface IConsumableOrdersStore : IStore<ConsumableOrder>
    {
        Task<bool> TrySetStateAsync(
            string orderId,
            OrderState expectedCurrentState,
            OrderState newState);
    }

    public class ConsumableOrdersStore : GenericStore<ConsumableOrder>, IConsumableOrdersStore
    {
        public ConsumableOrdersStore(IMongoDatabase mongoDatabase)
            : base(mongoDatabase)
        {
        }

        public async Task<bool> TrySetStateAsync(
            string orderId,
            OrderState expectedCurrentState,
            OrderState newState)
        {
            if (expectedCurrentState == newState)
                return true;
            var result = await collection.UpdateOneAsync(
                x => x.Id == orderId && x.State == expectedCurrentState,
                Builders<ConsumableOrder>.Update.Set(x => x.State, newState));
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }
    }
}
