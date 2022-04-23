using System;
using HealthModels;

namespace HealthSharingPortal.API.Models.Subscriptions
{
    public abstract class SubscriptionBase : IId
    {
        protected SubscriptionBase() {}
        protected SubscriptionBase(
            string id, 
            string accountId)
        {
            Id = id;
            AccountId = accountId;
        }

        public string Id { get; set; }
        public string AccountId { get; set; }
        public DateTime? MutedUntil { get; set; }
        public abstract string Type { get; }
    }
}