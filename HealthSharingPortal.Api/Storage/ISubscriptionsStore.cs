using System.Collections.Generic;
using System.Threading.Tasks;
using HealthSharingPortal.API.Models.Subscriptions;
using MongoDB.Driver;

namespace HealthSharingPortal.API.Storage
{
    public interface ISubscriptionsStore : IStore<SubscriptionBase>
    {
        Task<List<PatientSubscription>> GetPatientSubscriptions(string personId);
        Task<PatientSubscription> GetPatientSubscription(string personId, string username);
    }

    public class SubscriptionsStore : GenericStore<SubscriptionBase>, ISubscriptionsStore
    {
        public SubscriptionsStore(IMongoDatabase mongoDatabase)
            : base(mongoDatabase)
        {
        }

        public Task<List<PatientSubscription>> GetPatientSubscriptions(string personId)
        {
            return collection.OfType<PatientSubscription>().Find(x => x.PersonId == personId).ToListAsync();
        }

        public Task<PatientSubscription> GetPatientSubscription(
            string personId,
            string username)
        {
            return collection.OfType<PatientSubscription>().Find(x => x.PersonId == personId && x.AccountId == username).FirstOrDefaultAsync();
        }
    }
}
