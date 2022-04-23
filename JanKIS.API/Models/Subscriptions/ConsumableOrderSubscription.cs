namespace JanKIS.API.Models.Subscriptions
{
    public class ConsumableOrderSubscription : HealthSharingPortal.API.Models.Subscriptions.SubscriptionBase
    {
        public ConsumableOrderSubscription(){}

        public ConsumableOrderSubscription(
            string id,
            string accountId,
            string orderId)
            : base(id, accountId)
        {
            OrderId = orderId;
        }

        public override string Type => SubscriptionObjectType.ConsumableOrder.ToString();
        public string OrderId { get; set; }
    }
}