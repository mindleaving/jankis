using System.Collections.Generic;
using System.Threading.Tasks;
using HealthSharingPortal.API.Storage;
using MongoDB.Driver;
using NotificationBase = HealthSharingPortal.API.Models.Subscriptions.NotificationBase;

namespace JanKIS.API.Storage
{
    public interface INotificationsStore : IStore<HealthSharingPortal.API.Models.Subscriptions.NotificationBase>
    {
        Task<List<HealthSharingPortal.API.Models.Subscriptions.NotificationBase>> GetAllForUser(string username, int? count = null, int? skip = null, bool includeDismissed = false);
        Task<StorageResult> Dismiss(string notificationId);
    }

    public class NotificationsStore : GenericStore<HealthSharingPortal.API.Models.Subscriptions.NotificationBase>, INotificationsStore
    {
        public NotificationsStore(IMongoDatabase mongoDatabase)
            : base(mongoDatabase)
        {
        }

        public Task<List<HealthSharingPortal.API.Models.Subscriptions.NotificationBase>> GetAllForUser(
            string username, 
            int? count = null, 
            int? skip = null,
            bool includeDismissed = false)
        {
            return collection
                .Find(x => x.Subscription.Username == username && (!x.IsDismissed || includeDismissed))
                .SortByDescending(x => x.Timestamp)
                .Skip(skip)
                .Limit(count)
                .ToListAsync();
        }

        public async Task<StorageResult> Dismiss(string notificationId)
        {
            var result = await collection.UpdateOneAsync(
                x => x.Id == notificationId,
                Builders<NotificationBase>.Update
                    .Set(x => x.IsDismissed, true));
            if(result.MatchedCount == 0)
                return StorageResult.Error(StoreErrorType.NoMatch);
            return StorageResult.Success();
        }
    }
}
