using System;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver.GeoJsonObjectModel;

namespace HealthModels.Icd.Annotation.Epidemiology
{
    public class Location : ILocation
    {
        public Location(
            string name,
            LocationType type,
            string country,
            string countryCode,
            GeoJson2DGeographicCoordinates coordinate)
        {
            Id = Guid.NewGuid().ToString();
            Type = type;
            Name = name;
            Country = country;
            CountryCode = countryCode;
            Coordinate = coordinate;
        }

        [BsonId]
        public string Id { get; private set; }
        public LocationType Type { get; set; }
        public string Name { get; set; }
        public string Country { get; set; }
        public string CountryCode { get; set; }
        public GeoJson2DGeographicCoordinates Coordinate { get; set; }
    }
}
