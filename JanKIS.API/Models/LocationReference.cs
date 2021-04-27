namespace JanKIS.API.Models
{
    public class LocationReference
    {
        public LocationReference() {}
        public LocationReference(
            LocationType type,
            string id)
        {
            Type = type;
            Id = id;
        }

        public LocationType Type { get; set; }
        public string Id { get; set; }
    }
}