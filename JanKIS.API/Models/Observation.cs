using System;
using JanKIS.API.Storage;
using MongoDB.Bson.Serialization.Attributes;

namespace JanKIS.API.Models
{
    [BsonKnownTypes(typeof(BloodPressureObservation))]
    public abstract class Observation : IId, IPatientEvent
    {
        public string Id { get; set; }
        public string PatientId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime Timestamp { get; set; }
        public string Type { get; set; }
    }
}