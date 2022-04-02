namespace JanKIS.API.Models.Subscriptions
{
    public class ConsumableOrderSubscription : HealthSharingPortal.API.Models.Subscriptions.SubscriptionBase
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