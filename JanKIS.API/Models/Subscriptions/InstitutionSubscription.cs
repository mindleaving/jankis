using HealthSharingPortal.API.Models.Subscriptions;

namespace JanKIS.API.Models.Subscriptions
{
    public class InstitutionSubscription : HealthSharingPortal.API.Models.Subscriptions.SubscriptionBase
    {
        public InstitutionSubscription()
        {
        }

        public InstitutionSubscription(string id,
            string username,
            string institutionId)
            : base(id, username)
        {
            InstitutionId = institutionId;
        }

        public override string Type => SubscriptionObjectType.Institution.ToString();
        public string InstitutionId { get; set; }
    }
}