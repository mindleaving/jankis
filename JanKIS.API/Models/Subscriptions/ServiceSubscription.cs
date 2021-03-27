namespace JanKIS.API.Models.Subscriptions
{
    public class ServiceSubscription : SubscriptionBase
    {
        public string ServiceId { get; set; }
    }

    public abstract class SubscriptionBase
    {
        public string EmployeeId { get; set; }
    }
}
