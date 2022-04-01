using HealthSharingPortal.API.Models.Subscriptions;

namespace JanKIS.API.Models.Subscriptions
{
    public class ResourceSubscription : HealthSharingPortal.API.Models.Subscriptions.SubscriptionBase
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

        public override string Type => SubscriptionObjectType.Resource.ToString();
        public string ResourceId { get; set; }
    }
}