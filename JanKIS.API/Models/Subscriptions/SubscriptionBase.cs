using System;
using HealthModels;
using JanKIS.API.Converters;
using JanKIS.API.Storage;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace JanKIS.API.Models.Subscriptions
{
    [BsonKnownTypes(
        typeof(ServiceSubscription),
        typeof(ServiceRequestSubscription),
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
        public abstract SubscriptionObjectType Type { get; }
    }
}