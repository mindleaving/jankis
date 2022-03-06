﻿using System;
using HealthModels.Converters;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using TypescriptGenerator.Attributes;

namespace HealthModels.Observations
{
    [BsonKnownTypes(
        typeof(PulseObservation), 
        typeof(BloodPressureObservation),
        typeof(TemperatureObservation),
        typeof(GenericObservation)
    )]
    [JsonConverter(typeof(ObservationsJsonConverter))]
    public abstract class Observation : IPatientEvent
    {
        public string Id { get; set; }
        public PatientEventType Type => PatientEventType.Observation;
        public string PatientId { get; set; }
        [TypescriptIsOptional]
        public string AdmissionId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime Timestamp { get; set; }
        public abstract string MeasurementType { get; set; }
    }
}