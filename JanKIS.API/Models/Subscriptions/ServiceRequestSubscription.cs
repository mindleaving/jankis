using HealthSharingPortal.API.Models.Subscriptions;

namespace JanKIS.API.Models.Subscriptions
{
    public class ServiceRequestSubscription : HealthSharingPortal.API.Models.Subscriptions.SubscriptionBase
    {
        public ServiceRequestSubscription()
        {
        }

        public ServiceRequestSubscription(string id,
            string accountId,
            string requestId)
            : base(id, accountId)
        {
            RequestId = requestId;
        }

        public override string Type => SubscriptionObjectType.ServiceRequest.ToString();
        public string RequestId { get; set; }
    }
}