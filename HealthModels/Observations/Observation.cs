using System;
using System.ComponentModel.DataAnnotations;
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
        [Required]
        public string Id { get; set; }
        public HealthRecordEntryType Type => HealthRecordEntryType.Observation;
        [Required]
        public string PersonId { get; set; }
        public string CreatedBy { get; set; }
        [Required]
        public DateTime Timestamp { get; set; }
        public bool IsVerified { get; set; }
        public bool HasBeenSeenBySharer { get; set; }
        public abstract string MeasurementType { get; set; }
    }
}