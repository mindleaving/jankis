using System;
using HealthModels.Observations;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace HealthModels.Converters
{
    public class ObservationsJsonConverter : JsonConverter<Observation>
    {
        public override bool CanWrite { get; } = false;

        public override void WriteJson(
            JsonWriter writer,
            Observation value,
            JsonSerializer serializer)
        {
            throw new NotSupportedException();
        }

        public override Observation ReadJson(
            JsonReader reader,
            Type objectType,
            Observation existingValue,
            bool hasExistingValue,
            JsonSerializer serializer)
        {
            var jObject = JObject.Load(reader);
            if(!jObject.TryGetValue(nameof(Observation.MeasurementType), StringComparison.InvariantCultureIgnoreCase, out var measurementTypeToken))
                throw new FormatException($"Could not find field '{nameof(Observation.MeasurementType)}' in JSON that is supposed to be of type '{nameof(Observation)}'");
            var measurementType = measurementTypeToken.Value<string>();
            Observation observation;
            if (IsMeasurementType(measurementType, MeasurementType.Pulse))
            {
                observation = new PulseObservation();
            } 
            else if (IsMeasurementType(measurementType, MeasurementType.BloodPressure))
            {
                observation = new BloodPressureObservation();
            }
            else if (IsMeasurementType(measurementType, MeasurementType.Temperature))
            {
                observation = new TemperatureObservation();
            }
            else
            {
                observation = new GenericObservation(measurementType);
            }
            serializer.Populate(jObject.CreateReader(), observation);
            return observation;
        }

        private static bool IsMeasurementType(
            string measurementType,
            MeasurementType enumMeasurementType)
        {
            return string.Equals(measurementType, enumMeasurementType.ToString(), StringComparison.InvariantCultureIgnoreCase);
        }
    }
}
