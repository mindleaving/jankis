using System;
using HealthModels.Services;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace HealthModels.Converters
{
    public class ServiceParameterResponseJsonConverter : JsonConverter<ServiceParameterResponse>
    {
        public override bool CanWrite { get; } = false;

        public override void WriteJson(
            JsonWriter writer,
            ServiceParameterResponse value,
            JsonSerializer serializer)
        {
            throw new NotSupportedException();
        }

        public override ServiceParameterResponse ReadJson(
            JsonReader reader,
            Type objectType,
            ServiceParameterResponse existingValue,
            bool hasExistingValue,
            JsonSerializer serializer)
        {
            var jObject = JObject.Load(reader);

            var parameterTypeToken = jObject.GetValue(nameof(ServiceParameterResponse.ValueType), StringComparison.InvariantCultureIgnoreCase);
            var parameterType = Enum.Parse<ServiceParameterValueType>(parameterTypeToken.Value<string>(), true);
            ServiceParameterResponse response;
            switch (parameterType)
            {
                case ServiceParameterValueType.Text:
                    response = new TextServiceParameterResponse();
                    break;
                case ServiceParameterValueType.Number:
                    response = new NumberServiceParameterResponse();
                    break;
                case ServiceParameterValueType.Patient:
                    response = new PatientServiceParameterResponse();
                    break;
                case ServiceParameterValueType.Option:
                    response = new OptionsServiceParameterResponse();
                    break;
                case ServiceParameterValueType.Boolean:
                    response = new BooleanServiceParameterResponse();
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
            serializer.Populate(jObject.CreateReader(), response);
            return response;
        }
    }
}
