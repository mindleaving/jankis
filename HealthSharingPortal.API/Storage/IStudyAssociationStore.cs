using System.Threading.Tasks;
using HealthSharingPortal.API.Models;
using MongoDB.Driver;

namespace HealthSharingPortal.API.Storage
{
    public interface IStudyAssociationStore : IStore<StudyAssociation>
    {
        Task DeleteAllForAccount(
            string accountId);
    }

    public class StudyAssociationStore : GenericStore<StudyAssociation>, IStudyAssociationStore
    {
        public StudyAssociationStore(
            IMongoDatabase mongoDatabase,
            string collectionName = null)
            : base(mongoDatabase, collectionName)
        {
        }

        public async Task DeleteAllForAccount(
            string accountId)
        {
            await collection.DeleteManyAsync(x => x.AccountId == accountId);
        }
    }
}
