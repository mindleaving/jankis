using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Models;
using MongoDB.Driver;

namespace HealthSharingPortal.API.Storage
{
    public class AccountStore: GenericStore<Account>, IAccountStore
    {
        private readonly IMongoCollection<Login> loginCollection;

        public AccountStore(IMongoDatabase mongoDatabase)
            : base(mongoDatabase)
        {
            loginCollection = mongoDatabase.GetCollection<Login>(nameof(Login));
        }


        public async Task DeleteAllForPerson(string personId)
        {
            var matchingAccounts = await collection.Find(x => x.PersonId == personId).ToListAsync();
            var loginIds = matchingAccounts.SelectMany(x => x.LoginIds).ToList();
            await loginCollection.DeleteManyAsync(x => loginIds.Contains(x.Id));
            await collection.DeleteManyAsync(x => x.PersonId == personId);
        }

        public Task<List<Account>> GetForLoginAsync(Login login)
        {
            return collection.Find(x => x.LoginIds.Contains(login.Id)).ToListAsync();
        }
    }
}
