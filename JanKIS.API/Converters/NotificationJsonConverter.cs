using System;
using JanKIS.API.Models.Subscriptions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NotificationBase = HealthSharingPortal.API.Models.Subscriptions.NotificationBase;

namespace JanKIS.API.Converters
{
    public class NotificationJsonConverter : JsonConverter<HealthSharingPortal.API.Models.Subscriptions.NotificationBase>
    {
        public override bool CanWrite { get; } = false;

        public override void WriteJson(
            JsonWriter writer,
            HealthSharingPortal.API.Models.Subscriptions.NotificationBase value,
            JsonSerializer serializer)
        {
            throw new NotSupportedException();
        }

        public override HealthSharingPortal.API.Models.Subscriptions.NotificationBase ReadJson(
            JsonReader reader,
            Type objectType,
            HealthSharingPortal.API.Models.Subscriptions.NotificationBase existingValue,
            bool hasExistingValue,
            JsonSerializer serializer)
        {
            var jObject = JObject.Load(reader);

            var notificationTypeToken = jObject.GetValue(nameof(HealthSharingPortal.API.Models.Subscriptions.NotificationBase.NotificationType), StringComparison.InvariantCultureIgnoreCase);
            var notificationType = Enum.Parse<NotificationType>(notificationTypeToken.Value<string>(), true);
            NotificationBase notification;
            switch (notificationType)
            {
                default:
                    throw new NotImplementedException();
            }
            serializer.Populate(jObject.CreateReader(), notification);
            return notification;
        }
    }
}
