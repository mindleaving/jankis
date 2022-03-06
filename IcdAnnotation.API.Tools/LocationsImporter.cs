using System.Globalization;
using System.IO;
using System.Linq;
using HealthModels.Icd.Annotation.Epidemiology;
using IcdAnnotation.API.Models;
using MongoDB.Driver;
using MongoDB.Driver.GeoJsonObjectModel;
using NUnit.Framework;

namespace IcdAnnotation.API.Tools
{
    public class LocationsImporter : DatabaseAccess
    {
        [Test]
        public void ImportCities()
        {
            var locationsFilePath = @"G:\Projects\DoctorsTodo\worldcities.csv";
            var locationsCollection = GetCollection<Location>("Location");
            foreach (var line in File.ReadLines(locationsFilePath).Skip(1))
            {
                var values = ParserHelpers.QuoteAwareSplit(line, ',');
                var cityName = values[1];
                var latitude = double.Parse(values[2], CultureInfo.InvariantCulture);
                var longitude = double.Parse(values[3], CultureInfo.InvariantCulture);
                var countryName = values[4];
                var iso3Code = values[6];
                var isPopulationKnown = int.TryParse(values[9], out var population);
                var coordinate = new GeoJson2DGeographicCoordinates(longitude, latitude);
                var city = new Location(
                    $"{cityName} ({countryName})",
                    LocationType.City,
                    countryName,
                    iso3Code,
                    coordinate);
                if(!locationsCollection.Find(x => x.Name == city.Name).Any())
                    locationsCollection.InsertOne(city);
            }
        }
    }
}
