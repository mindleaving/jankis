namespace JanKIS.API.Models
{
    public class RoleServiceAudience : ServiceAudience
    {
        public override ServiceAudienceType Type => ServiceAudienceType.Role;
        public string RoleId { get; set; }
    }
}