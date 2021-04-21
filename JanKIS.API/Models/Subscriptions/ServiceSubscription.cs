namespace JanKIS.API.Models.Subscriptions
{
    public class ServiceSubscription : SubscriptionBase
    {
        public ServiceSubscription()
        {
        }

        public ServiceSubscription(string id,
            string username,
            string serviceId)
            : base(id, username)
        {
            ServiceId = serviceId;
        }

        public override SubscriptionObjectType Type => SubscriptionObjectType.Service;
        public string ServiceId { get; set; }
    }
}
