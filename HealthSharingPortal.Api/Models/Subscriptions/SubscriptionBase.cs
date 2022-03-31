using System;
using HealthModels;
using HealthSharingPortal.API.Converters;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace HealthSharingPortal.API.Models.Subscriptions
{
    [BsonKnownTypes(
        typeof(PatientSubscription)
    )]
    [JsonConverter(typeof(SubscriptionJsonConverter))]
    public abstract class SubscriptionBase : IId
    {
        protected SubscriptionBase() {}
        protected SubscriptionBase(
            string id, 
            string username)
        {
            Id = id;
            Username = username;
        }

        public string Id { get; set; }
        public string Username { get; set; }
        public DateTime? MutedUntil { get; set; }
        public abstract string Type { get; }
    }
}