using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.AccessControl
{
    public class ExternalLogin : Login
    {
        public override LoginType Type => LoginType.External;
        public LoginProvider LoginProvider { get; set; }
        public string ExternalId { get; set; }
    }
}