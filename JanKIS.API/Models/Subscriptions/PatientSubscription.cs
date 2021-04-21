namespace JanKIS.API.Models.Subscriptions
{
    public class PatientSubscription : SubscriptionBase
    {
        public PatientSubscription() {}
        public PatientSubscription(string id,
            string username,
            string patientId,
            bool cancelSubscriptionOnDischarge)
            : base(id, username)
        {
            PatientId = patientId;
            CancelSubscriptionOnDischarge = cancelSubscriptionOnDischarge;
        }

        public override SubscriptionObjectType Type => SubscriptionObjectType.Patient;
        public string PatientId { get; set; }
        public bool CancelSubscriptionOnDischarge { get; set; }
    }
}