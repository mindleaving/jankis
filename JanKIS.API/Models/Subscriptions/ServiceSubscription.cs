using HealthSharingPortal.API.Models.Subscriptions;

namespace JanKIS.API.Models.Subscriptions
{
    public class ServiceSubscription : HealthSharingPortal.API.Models.Subscriptions.SubscriptionBase
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

        public override string Type => SubscriptionObjectType.Service.ToString();
        public string ServiceId { get; set; }
    }
}
