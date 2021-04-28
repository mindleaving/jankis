namespace JanKIS.API.Models.Subscriptions
{
    public class ConsumableOrderSubscription : SubscriptionBase
    {
        public ConsumableOrderSubscription(){}

        public ConsumableOrderSubscription(
            string id,
            string username,
            string orderId)
            : base(id, username)
        {
            OrderId = orderId;
        }

        public override SubscriptionObjectType Type => SubscriptionObjectType.ConsumableOrder;
        public string OrderId { get; set; }
    }
}