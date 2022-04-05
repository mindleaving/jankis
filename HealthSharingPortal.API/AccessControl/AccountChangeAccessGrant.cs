namespace HealthSharingPortal.API.AccessControl
{
    public class AccountChangeAccessGrant : IPersonDataAccessGrant
    {
        public string Username { get; set; }
    }
}