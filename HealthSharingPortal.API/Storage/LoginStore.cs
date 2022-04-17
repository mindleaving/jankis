using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Models;
using MongoDB.Driver;

namespace HealthSharingPortal.API.Storage
{
    public class LoginStore : GenericStore<Login>, ILoginStore
    {
        public LoginStore(
            IMongoDatabase mongoDatabase,
            string collectionName = null)
            : base(mongoDatabase, collectionName)
        {
        }

        public async Task<StorageResult> ChangePasswordAsync(
            string username,
            string passwordBase64,
            bool changePasswordOnNextLogin)
        {
            var result = await collection
                .OfType<LocalLogin>()
                .UpdateOneAsync(
                    x => x.Id == username, 
                    Builders<LocalLogin>.Update
                        .Set(x => x.PasswordHash, passwordBase64)
                        .Set(x => x.IsPasswordChangeRequired, changePasswordOnNextLogin));
            if(!result.IsAcknowledged)
                return StorageResult.Error(StoreErrorType.UnknownDatabaseError);
            if(result.MatchedCount == 0)
                return StorageResult.Error(StoreErrorType.NoMatch);
            return StorageResult.Success();
        }

        public Task<ExternalLogin> GetExternalByIdAsync(
            LoginProvider loginProvider,
            string externalId)
        {
            return collection
                .OfType<ExternalLogin>()
                .Find(x => x.LoginProvider == loginProvider && x.ExternalId == externalId)
                .FirstOrDefaultAsync();
        }

        public Task<LocalLogin> GetLocalByUsername(string username)
        {
            return collection.OfType<LocalLogin>().Find(x => x.Username == username).FirstOrDefaultAsync();
        }

        public async Task<Login> GetFromClaimsAsync(List<Claim> claims)
        {
            var usernameClaim = claims.Find(x => x.Type == JwtSecurityTokenBuilder.UsernameClaimName && x.Issuer == JwtSecurityTokenBuilder.Issuer);
            if (usernameClaim != null)
                return await GetByIdAsync(usernameClaim.Value);

            var loginProvider = claims.GetLoginProvider();
            if (loginProvider == LoginProvider.Unknown)
                return null;
            if (loginProvider == LoginProvider.LocalJwt)
                throw new Exception("This should not have happened. If login provider is LocalJwt, the usernameClaim should exist");

            var externalId = claims.GetExternalId(loginProvider);
            return await GetExternalByIdAsync(loginProvider, externalId);
        }
    }
}