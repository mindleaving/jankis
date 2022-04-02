﻿using System;
using HealthSharingPortal.API.Models.Subscriptions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace HealthSharingPortal.API.Converters
{
    internal class SubscriptionJsonConverter : JsonConverter<SubscriptionBase>
    {
        public override bool CanWrite { get; } = false;

        public override void WriteJson(
            JsonWriter writer,
            SubscriptionBase value,
            JsonSerializer serializer)
        {
            throw new NotSupportedException();
        }

        public override SubscriptionBase ReadJson(
            JsonReader reader,
            Type objectType,
            SubscriptionBase existingValue,
            bool hasExistingValue,
            JsonSerializer serializer)
        {
            var jObject = JObject.Load(reader);

            var subscriptionTypeToken = jObject.GetValue(nameof(SubscriptionBase.Type), StringComparison.InvariantCultureIgnoreCase);
            var subscriptionType = Enum.Parse<SubscriptionObjectType>(subscriptionTypeToken.Value<string>(), true);
            SubscriptionBase subscription;
            switch (subscriptionType)
            {
                case SubscriptionObjectType.Patient:
                    subscription = new PatientSubscription();
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
            serializer.Populate(jObject.CreateReader(), subscription);
            return subscription;
        }
    }
}
