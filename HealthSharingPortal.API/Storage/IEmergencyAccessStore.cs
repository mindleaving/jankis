using System.Threading.Tasks;
using HealthModels.AccessControl;
using MongoDB.Driver;

namespace HealthSharingPortal.API.Storage
{
    public interface ISharedAccessStore<T> : IStore<T> where T: ISharedAccess
    {
        Task DeleteAllForPerson(string personId);
    }

    public class SharedAccessStore<T> : GenericStore<T>, ISharedAccessStore<T> where T : ISharedAccess
    {
        public SharedAccessStore(
            IMongoDatabase mongoDatabase,
            string collectionName = null)
            : base(mongoDatabase, collectionName)
        {
        }

        public async Task DeleteAllForPerson(
            string personId)
        {
            await collection.DeleteManyAsync(x => x.SharerPersonId == personId);
        }
    }
}
