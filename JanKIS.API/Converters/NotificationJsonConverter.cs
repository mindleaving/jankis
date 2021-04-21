using System;
using JanKIS.API.Models.Subscriptions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace JanKIS.API.Converters
{
    public class NotificationJsonConverter : JsonConverter<NotificationBase>
    {
        public override bool CanWrite { get; } = false;

        public override void WriteJson(
            JsonWriter writer,
            NotificationBase value,
            JsonSerializer serializer)
        {
            throw new NotSupportedException();
        }

        public override NotificationBase ReadJson(
            JsonReader reader,
            Type objectType,
            NotificationBase existingValue,
            bool hasExistingValue,
            JsonSerializer serializer)
        {
            var jObject = JObject.Load(reader);

            var notificationTypeToken = jObject.GetValue(nameof(NotificationBase.NotificationType), StringComparison.InvariantCultureIgnoreCase);
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
