using HealthSharingPortal.API.Models.Subscriptions;

namespace JanKIS.API.Models.Subscriptions
{
    public class StockSubscription : HealthSharingPortal.API.Models.Subscriptions.SubscriptionBase
    {
        public StockSubscription()
        {
        }

        public StockSubscription(string id,
            string accountId,
            string stockId)
            : base(id, accountId)
        {
            StockId = stockId;
        }

        public override string Type => SubscriptionObjectType.Stock.ToString();
        public string StockId { get; set; }
    }
}