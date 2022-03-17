using System;
using HealthModels.Services;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace HealthModels.Converters
{
    public class ServiceAudienceJsonConverter : JsonConverter<ServiceAudience>
    {
        public override bool CanWrite { get; } = false;

        public override void WriteJson(
            JsonWriter writer,
            ServiceAudience value,
            JsonSerializer serializer)
        {
            throw new NotSupportedException();
        }

        public override ServiceAudience ReadJson(
            JsonReader reader,
            Type objectType,
            ServiceAudience existingValue,
            bool hasExistingValue,
            JsonSerializer serializer)
        {
            var jObject = JObject.Load(reader);

            var audienceTypeToken = jObject.GetValue(nameof(ServiceAudience.Type), StringComparison.InvariantCultureIgnoreCase);
            var audienceType = Enum.Parse<ServiceAudienceType>(audienceTypeToken.Value<string>(), true);
            ServiceAudience audience;
            switch (audienceType)
            {
                case ServiceAudienceType.All:
                    audience = new AllServiceAudience();
                    break;
                case ServiceAudienceType.Role:
                    audience = new RoleServiceAudience();
                    break;
                case ServiceAudienceType.Person:
                    audience = new PersonServiceAudience();
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
            serializer.Populate(jObject.CreateReader(), audience);
            return audience;
        }
    }
}
