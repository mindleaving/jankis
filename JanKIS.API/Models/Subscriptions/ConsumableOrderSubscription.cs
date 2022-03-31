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

        public override string Type => SubscriptionObjectType.ConsumableOrder.ToString();
        public string OrderId { get; set; }
    }
}