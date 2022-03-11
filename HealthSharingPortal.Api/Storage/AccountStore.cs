using System.Collections.Generic;
using System.Threading.Tasks;
using HealthSharingPortal.Api.Models;
using MongoDB.Driver;

namespace HealthSharingPortal.Api.Storage
{
    public class AccountStore: GenericStore<Account>, IAccountStore
    {
        public AccountStore(IMongoDatabase mongoDatabase)
            : base(mongoDatabase)
        {
        }

        public async Task<StorageResult> ChangePasswordAsync(
            string username,
            string passwordBase64,
            bool changePasswordOnNextLogin)
        {
            var result = await collection.UpdateOneAsync(
                x => x.Id == username, 
                Builders<Account>.Update
                    .Set(x => x.PasswordHash, passwordBase64)
                    .Set(x => x.IsPasswordChangeRequired, changePasswordOnNextLogin));
            if(!result.IsAcknowledged)
                return StorageResult.Error(StoreErrorType.UnknownDatabaseError);
            if(result.MatchedCount == 0)
                return StorageResult.Error(StoreErrorType.NoMatch);
            return StorageResult.Success();
        }

        public Task DeleteAllForPerson(string personId)
        {
            return collection.DeleteManyAsync(x => x.PersonId == personId);
        }
    }
}
