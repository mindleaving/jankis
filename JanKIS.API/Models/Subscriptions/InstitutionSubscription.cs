using HealthSharingPortal.API.Models.Subscriptions;

namespace JanKIS.API.Models.Subscriptions
{
    public class InstitutionSubscription : HealthSharingPortal.API.Models.Subscriptions.SubscriptionBase
    {
        public InstitutionSubscription()
        {
        }

        public InstitutionSubscription(string id,
            string accountId,
            string institutionId)
            : base(id, accountId)
        {
            InstitutionId = institutionId;
        }

        public override string Type => SubscriptionObjectType.Institution.ToString();
        public string InstitutionId { get; set; }
    }
}