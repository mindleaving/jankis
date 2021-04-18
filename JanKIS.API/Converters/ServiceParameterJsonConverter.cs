using System;
using JanKIS.API.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace JanKIS.API.Converters
{
    public class ServiceParameterJsonConverter : JsonConverter<ServiceParameter>
    {
        public override bool CanWrite { get; } = false;

        public override void WriteJson(
            JsonWriter writer,
            ServiceParameter value,
            JsonSerializer serializer)
        {
            throw new NotSupportedException();
        }

        public override ServiceParameter ReadJson(
            JsonReader reader,
            Type objectType,
            ServiceParameter existingValue,
            bool hasExistingValue,
            JsonSerializer serializer)
        {
            var jObject = JObject.Load(reader);

            var parameterTypeToken = jObject.GetValue(nameof(ServiceParameter.ValueType), StringComparison.InvariantCultureIgnoreCase);
            var parameterType = Enum.Parse<ServiceParameterValueType>(parameterTypeToken.Value<string>(), true);
            ServiceParameter parameter;
            switch (parameterType)
            {
                case ServiceParameterValueType.Text:
                    parameter = new TextServiceParameter();
                    break;
                case ServiceParameterValueType.Number:
                    parameter = new NumberServiceParameter();
                    break;
                case ServiceParameterValueType.Patient:
                    parameter = new PatientServiceParameter();
                    break;
                case ServiceParameterValueType.Option:
                    parameter = new OptionsServiceParameter();
                    break;
                case ServiceParameterValueType.Boolean:
                    parameter = new BooleanServiceParameter();
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
            serializer.Populate(jObject.CreateReader(), parameter);
            return parameter;
        }
    }
}
