namespace HealthSharingPortal.API.AccessControl
{
    public class AccountChangeAccessGrant : IPersonDataAccessGrant
    {
        public string AccountId { get; set; }
    }
}