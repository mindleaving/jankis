using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Security;
using System.Threading.Tasks;
using Commons.Extensions;
using HealthModels.AccessControl;
using HealthSharingPortal.API.AccessControl;
using HealthSharingPortal.API.Models;
using MongoDB.Driver;

namespace HealthSharingPortal.API.Storage
{
    public class HealthProfessionalAccessInviteStore : IHealthProfessionalAccessInviteStore
    {
        private readonly IMongoCollection<HealthProfessionalAccessInvite> collection;

        public HealthProfessionalAccessInviteStore(
            IMongoDatabase mongoDatabase,
            string collectionName = null)
        {
            collection = mongoDatabase.GetCollection<HealthProfessionalAccessInvite>(collectionName ?? nameof(HealthProfessionalAccessInvite));
        }

        public async Task<string> CreateNew(
            string accessReceiverUsername,
            string sharerPersonId,
            TimeSpan expirationDuration,
            List<AccessPermissions> permissions)
        {
            if (accessReceiverUsername == null) throw new ArgumentNullException(nameof(accessReceiverUsername));
            if (sharerPersonId == null) throw new ArgumentNullException(nameof(sharerPersonId));
            if (permissions == null) throw new ArgumentNullException(nameof(permissions));
            var utcNow = DateTime.UtcNow;
            var accessInvite = new HealthProfessionalAccessInvite
            {
                Id = Guid.NewGuid().ToString(),
                SharerPersonId = sharerPersonId,
                AccessReceiverUsername = accessReceiverUsername,
                Permissions = permissions,
                CreatedTimestamp = utcNow,
                ExpirationDuration = expirationDuration,
                CodeForSharer = GenerateHealthProfessionalAccessInviteCode(),
                CodeForHealthProfessional = GenerateHealthProfessionalAccessInviteCode()
            };
            await collection.InsertOneAsync(accessInvite);
            return accessInvite.Id;
        }
        private string GenerateHealthProfessionalAccessInviteCode()
        {
            var passwordGenerator = new TemporaryPasswordGenerator { AllowedCharacters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" };
            return passwordGenerator.Generate(length: 6).ToUpper();
        }

        public async Task<bool> SetSharerHasAccepted(string inviteId)
        {
            var updateDefinitionBuilder = Builders<HealthProfessionalAccessInvite>.Update;
            var updateResult = await collection.UpdateOneAsync(
                x => x.Id == inviteId,
                updateDefinitionBuilder.Combine(
                    updateDefinitionBuilder.Set(x => x.SharerHasAccepted, true),
                    updateDefinitionBuilder.Set(x => x.SharerHasAcceptedTimestamp, DateTime.UtcNow)
                )
            );
            return updateResult.IsAcknowledged && updateResult.MatchedCount == 1;
        }

        public async Task<bool> SetHealthProfessionalHasAccepted(string inviteId)
        {
            var updateDefinitionBuilder = Builders<HealthProfessionalAccessInvite>.Update;
            var updateResult = await collection.UpdateOneAsync(
                x => x.Id == inviteId,
                updateDefinitionBuilder.Combine(
                    updateDefinitionBuilder.Set(x => x.HealthProfessionalHasAccepted, true),
                    updateDefinitionBuilder.Set(x => x.HealthProfessionalHasAcceptedTimestamp, DateTime.UtcNow)
                )
            );
            return updateResult.IsAcknowledged && updateResult.MatchedCount == 1;
        }

        public async Task<bool> Revoke(string inviteId)
        {
            var updateDefinitionBuilder = Builders<HealthProfessionalAccessInvite>.Update;
            var updateResult = await collection.UpdateOneAsync(
                x => x.Id == inviteId && !x.IsCompleted,
                updateDefinitionBuilder.Combine(
                    updateDefinitionBuilder.Set(x => x.IsRevoked, true),
                    updateDefinitionBuilder.Set(x => x.RevokedTimestamp, DateTime.UtcNow)
                )
            );
            return updateResult.IsAcknowledged && updateResult.MatchedCount == 1;
        }

        public async Task<bool> Reject(string inviteId)
        {
            var updateDefinitionBuilder = Builders<HealthProfessionalAccessInvite>.Update;
            var updateResult = await collection.UpdateOneAsync(
                x => x.Id == inviteId && !x.IsCompleted,
                updateDefinitionBuilder.Combine(
                    updateDefinitionBuilder.Set(x => x.IsRejected, true),
                    updateDefinitionBuilder.Set(x => x.RejectedTimestamp, DateTime.UtcNow)
                )
            );
            return updateResult.IsAcknowledged && updateResult.MatchedCount == 1;
        }

        public async Task<HealthProfessionalAccessInvite> GetByIdAndRemoveCode(
            string inviteId, 
            AccountType requesterAccountType)
        {
            var item = await collection.Find(x => x.Id == inviteId).FirstOrDefaultAsync();
            RemoveInformationNotIntendedForRequester(requesterAccountType, item);
            return item;
        }

        public async Task<IEnumerable<HealthProfessionalAccessInvite>> SearchAsync(
            Expression<Func<HealthProfessionalAccessInvite, bool>> filter,
            AccountType requesterAccountType)
        {
            if(!requesterAccountType.InSet(AccountType.Sharer, AccountType.HealthProfessional, AccountType.Admin))
                throw new SecurityException($"{requesterAccountType}s cannot view access invites");
            var items = await collection.Find(filter).ToListAsync();
            items.ForEach(item => RemoveInformationNotIntendedForRequester(requesterAccountType, item));
            return items;
        }

        public async Task<bool> CheckCodeFromSharer(
            string inviteId,
            string codeForSharer)
        {
            var updateDefinitionBuilder = Builders<HealthProfessionalAccessInvite>.Update;
            var updateResult = await collection.UpdateOneAsync(
                x => x.Id == inviteId && x.CodeForSharer == codeForSharer,
                updateDefinitionBuilder.Combine(
                    updateDefinitionBuilder.Set(x => x.SharerHasAccepted, true),
                    updateDefinitionBuilder.Set(x => x.SharerHasAcceptedTimestamp, DateTime.UtcNow)
                )
            );
            return updateResult.IsAcknowledged && updateResult.MatchedCount == 1;
        }

        public async Task<bool> CheckCodeFromHealthProfessional(
            string inviteId,
            string codeForHealthProfessional)
        {
            var updateDefinitionBuilder = Builders<HealthProfessionalAccessInvite>.Update;
            var updateResult = await collection.UpdateOneAsync(
                x => x.Id == inviteId && x.CodeForHealthProfessional == codeForHealthProfessional,
                updateDefinitionBuilder.Combine(
                    updateDefinitionBuilder.Set(x => x.HealthProfessionalHasAccepted, true),
                    updateDefinitionBuilder.Set(x => x.HealthProfessionalHasAcceptedTimestamp, DateTime.UtcNow)
                )
            );
            return updateResult.IsAcknowledged && updateResult.MatchedCount == 1;
        }

        public async Task<bool> TryMarkAsCompleted(string inviteId)
        {
            var updateDefinitionBuilder = Builders<HealthProfessionalAccessInvite>.Update;
            var updateResult = await collection.UpdateOneAsync(
                x => x.Id == inviteId && x.SharerHasAccepted && x.HealthProfessionalHasAccepted && !x.IsRejected && !x.IsRevoked,
                updateDefinitionBuilder.Combine(
                    updateDefinitionBuilder.Set(x => x.IsCompleted, true),
                    updateDefinitionBuilder.Set(x => x.CompletedTimestamp, DateTime.UtcNow)
                )
            );
            return updateResult.IsAcknowledged && updateResult.MatchedCount == 1;
        }

        private static void RemoveInformationNotIntendedForRequester(
            AccountType requesterAccountType,
            HealthProfessionalAccessInvite item)
        {
            if (item == null) 
                return;
            switch (requesterAccountType)
            {
                case AccountType.Sharer:
                    if(!item.IsCompleted)
                    {
                        item.CodeForSharer = null;
                    }
                    break;
                case AccountType.HealthProfessional:
                    if(!item.IsCompleted)
                    {
                        item.CodeForHealthProfessional = null;
                    }
                    break;
                case AccountType.Researcher:
                    throw new SecurityException("Researchers cannot view access invites");
                case AccountType.Admin:
                    // Nothing to do
                    return;
                default:
                    throw new ArgumentOutOfRangeException(nameof(requesterAccountType), requesterAccountType, null);
            }
        }
    }
}