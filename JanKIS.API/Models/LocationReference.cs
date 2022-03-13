namespace JanKIS.API.Models
{
    public class LocationReference
    {
        public LocationReference() {}
        public LocationReference(
            InstitutionLocationType type,
            string id)
        {
            Type = type;
            Id = id;
        }

        public InstitutionLocationType Type { get; set; }
        public string Id { get; set; }
    }
}