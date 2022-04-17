namespace HealthSharingPortal.API.Models.Subscriptions
{
    public class PatientSubscription : SubscriptionBase
    {
        public PatientSubscription() {}
        public PatientSubscription(string id,
            string accountId,
            string personId,
            bool cancelSubscriptionOnDischarge)
            : base(id, accountId)
        {
            PersonId = personId;
            CancelSubscriptionOnDischarge = cancelSubscriptionOnDischarge;
        }

        public override string Type => SubscriptionObjectType.Patient.ToString();
        public string PersonId { get; set; }
        public bool CancelSubscriptionOnDischarge { get; set; }
    }
}