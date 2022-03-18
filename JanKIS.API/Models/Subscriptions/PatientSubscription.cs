namespace JanKIS.API.Models.Subscriptions
{
    public class PatientSubscription : SubscriptionBase
    {
        public PatientSubscription() {}
        public PatientSubscription(string id,
            string username,
            string personId,
            bool cancelSubscriptionOnDischarge)
            : base(id, username)
        {
            PersonId = personId;
            CancelSubscriptionOnDischarge = cancelSubscriptionOnDischarge;
        }

        public override SubscriptionObjectType Type => SubscriptionObjectType.Patient;
        public string PersonId { get; set; }
        public bool CancelSubscriptionOnDischarge { get; set; }
    }
}