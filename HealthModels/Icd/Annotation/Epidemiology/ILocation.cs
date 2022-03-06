using MongoDB.Driver.GeoJsonObjectModel;

namespace HealthModels.Icd.Annotation.Epidemiology
{
    public interface ILocation : IId
    {
        LocationType Type { get; }
        string Name { get; set; }
        GeoJson2DGeographicCoordinates Coordinate { get; set; }
    }
}