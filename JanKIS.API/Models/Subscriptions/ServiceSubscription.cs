using HealthSharingPortal.API.Models.Subscriptions;

namespace JanKIS.API.Models.Subscriptions
{
    public class ServiceSubscription : HealthSharingPortal.API.Models.Subscriptions.SubscriptionBase
    {
        public ServiceSubscription()
        {
        }

        public ServiceSubscription(string id,
            string accountId,
            string serviceId)
            : base(id, accountId)
        {
            ServiceId = serviceId;
        }

        public override string Type => SubscriptionObjectType.Service.ToString();
        public string ServiceId { get; set; }
    }
}
