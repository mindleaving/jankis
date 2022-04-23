using HealthSharingPortal.API.Models.Subscriptions;

namespace JanKIS.API.Models.Subscriptions
{
    public class DepartmentSubscription : HealthSharingPortal.API.Models.Subscriptions.SubscriptionBase
    {
        public DepartmentSubscription()
        {
        }

        public DepartmentSubscription(string id,
            string accountId,
            string departmentId)
            : base(id, accountId)
        {
            DepartmentId = departmentId;
        }

        public override string Type => SubscriptionObjectType.Department.ToString();
        public string DepartmentId { get; set; }
    }
}