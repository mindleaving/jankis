namespace JanKIS.API.Models.Subscriptions
{
    public class ResourceSubscription : SubscriptionBase
    {
        public ResourceSubscription()
        {
        }

        public ResourceSubscription(string id,
            string username,
            string resourceId)
            : base(id, username)
        {
            ResourceId = resourceId;
        }

        public override SubscriptionObjectType Type => SubscriptionObjectType.Resource;
        public string ResourceId { get; set; }
    }
}