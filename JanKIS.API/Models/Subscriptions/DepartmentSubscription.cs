using HealthSharingPortal.API.Models.Subscriptions;

namespace JanKIS.API.Models.Subscriptions
{
    public class DepartmentSubscription : SubscriptionBase
    {
        public DepartmentSubscription()
        {
        }

        public DepartmentSubscription(string id,
            string username,
            string departmentId)
            : base(id, username)
        {
            DepartmentId = departmentId;
        }

        public override string Type => SubscriptionObjectType.Department.ToString();
        public string DepartmentId { get; set; }
    }
}