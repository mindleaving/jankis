namespace JanKIS.API.Models
{
    public class PersonServiceAudience : ServiceAudience
    {
        public override ServiceAudienceType Type => ServiceAudienceType.Person;
        public string PersonId { get; set; }
    }
}