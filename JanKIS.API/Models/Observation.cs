using JanKIS.API.Storage;
using MongoDB.Bson.Serialization.Attributes;

namespace JanKIS.API.Models
{
    [BsonKnownTypes(typeof(BloodPressureObservation))]
    public abstract class Observation : IId
    {
        public string Id { get; }
        public string PatientId { get; set; }
        public string Type { get; set; }
    }
}