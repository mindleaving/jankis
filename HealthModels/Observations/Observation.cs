using System;
using HealthModels.Converters;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace HealthModels.Observations
{
    [BsonKnownTypes(
        typeof(PulseObservation), 
        typeof(BloodPressureObservation),
        typeof(TemperatureObservation),
        typeof(GenericObservation)
    )]
    [JsonConverter(typeof(ObservationsJsonConverter))]
    public abstract class Observation : IHealthRecordEntry
    {
        public string Id { get; set; }
        public HealthRecordEntryType Type => HealthRecordEntryType.Observation;
        public string PersonId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime Timestamp { get; set; }
        public bool IsVerified { get; set; }
        public bool HasBeenSeenBySharer { get; set; }
        public abstract string MeasurementType { get; set; }
    }
}