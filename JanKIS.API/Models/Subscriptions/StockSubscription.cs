namespace JanKIS.API.Models.Subscriptions
{
    public class StockSubscription : SubscriptionBase
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

        public override SubscriptionObjectType Type => SubscriptionObjectType.Stock;
        public string StockId { get; set; }
    }
}