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

    public class PulseObservation : Observation
    {
        public int BPM { get; set; }
        public string Location { get; set; }
    }

    public class AutocompleteCacheItem
    {
        [BsonId]
        private string Id => $"{Context}_{Value}";
        public string Context { get; set; }
        public string Value { get; set; }
    }

    public class BloodPressureObservation : Observation
    {
        public int Systolic { get; set; }
        public int Diastolic { get; set; }
    }
}