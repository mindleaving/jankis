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

        public override SubscriptionObjectType Type => SubscriptionObjectType.Department;
        public string DepartmentId { get; set; }
    }
}