using System;
using HealthModels;

namespace HealthSharingPortal.API.Models.Subscriptions
{
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