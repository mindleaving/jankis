using System.Threading.Tasks;
using HealthSharingPortal.API.AccessControl;
using MongoDB.Driver;

namespace HealthSharingPortal.API.Storage
{
    public class MenschIdChallengeStore : GenericStore<MenschIdChallenge>, IMenschIdChallengeStore
    {
        public MenschIdChallengeStore(
            IMongoDatabase mongoDatabase,
            string collectionName = null)
            : base(mongoDatabase, collectionName)
        {
        }

        public Task IncrementAttemptsCount(
            string challengeId)
        {
            return collection.UpdateOneAsync(
                x => x.Id == challengeId,
                Builders<MenschIdChallenge>.Update.Inc(x => x.AttemptsCount, 1));
        }
    }

    public interface IMenschIdChallengeStore : IStore<MenschIdChallenge>
    {
        Task IncrementAttemptsCount(string challengeId);
    }
}
