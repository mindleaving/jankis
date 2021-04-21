namespace JanKIS.API.Models.Subscriptions
{
    public class InstitutionSubscription : SubscriptionBase
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

        public override SubscriptionObjectType Type => SubscriptionObjectType.Institution;
        public string InstitutionId { get; set; }
    }
}