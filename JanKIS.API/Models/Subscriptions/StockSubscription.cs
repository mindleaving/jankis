using HealthSharingPortal.API.Models.Subscriptions;

namespace JanKIS.API.Models.Subscriptions
{
    public class StockSubscription : HealthSharingPortal.API.Models.Subscriptions.SubscriptionBase
    {
        public StockSubscription()
        {
        }

        public StockSubscription(string id,
            string username,
            string stockId)
            : base(id, username)
        {
            StockId = stockId;
        }

        public override string Type => SubscriptionObjectType.Stock.ToString();
        public string StockId { get; set; }
    }
}