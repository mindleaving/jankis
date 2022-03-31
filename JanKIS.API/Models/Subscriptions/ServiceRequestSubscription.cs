using HealthSharingPortal.API.Models.Subscriptions;

namespace JanKIS.API.Models.Subscriptions
{
    public class ServiceRequestSubscription : SubscriptionBase
    {
        public ServiceRequestSubscription()
        {
        }

        public ServiceRequestSubscription(string id,
            string username,
            string requestId)
            : base(id, username)
        {
            RequestId = requestId;
        }

        public override string Type => SubscriptionObjectType.ServiceRequest.ToString();
        public string RequestId { get; set; }
    }
}