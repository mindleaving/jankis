namespace HealthSharingPortal.API.AccessControl
{
    public class LocalLogin : Login
    {
        public override LoginType Type => LoginType.Local;
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Salt { get; set; }
        public bool IsPasswordChangeRequired { get; set; }
    }
}