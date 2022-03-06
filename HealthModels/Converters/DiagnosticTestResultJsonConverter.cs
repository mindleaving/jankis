using System;
using HealthModels.DiagnosticTestResults;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace HealthModels.Converters
{
    public class DiagnosticTestResultJsonConverter : JsonConverter<DiagnosticTestResult>
    {
        public override bool CanWrite { get; } = false;

        public override void WriteJson(JsonWriter writer, DiagnosticTestResult value, JsonSerializer serializer)
        {
            throw new NotSupportedException();
        }

        public override DiagnosticTestResult ReadJson(
            JsonReader reader, 
            Type objectType, 
            DiagnosticTestResult existingValue,
            bool hasExistingValue, 
            JsonSerializer serializer)
        {
            var jObject = JObject.Load(reader);

            if(!jObject.TryGetValue(nameof(DiagnosticTestResult.ScaleType), StringComparison.InvariantCultureIgnoreCase, out var scaleTypeToken))
                throw new FormatException($"Could not find field '{nameof(DiagnosticTestResult.ScaleType)}' in JSON that is supposed to be of type '{nameof(DiagnosticTestResult)}'");
            var scaleType = Enum.Parse<DiagnosticTestScaleType>(scaleTypeToken.Value<string>());
            DiagnosticTestResult testResult;
            switch (scaleType)
            {
                case DiagnosticTestScaleType.Quantitative:
                    testResult = new QuantitativeDiagnosticTestResult();
                    break;
                case DiagnosticTestScaleType.Ordinal:
                    testResult = new OrdinalDiagnosticTestResult();
                    break;
                case DiagnosticTestScaleType.Nominal:
                    testResult = new NominalDiagnosticTestResult();
                    break;
                case DiagnosticTestScaleType.Freetext:
                    testResult = new FreetextDiagnosticTestResult();
                    break;
                case DiagnosticTestScaleType.Document:
                    testResult = new DocumentDiagnosticTestResult();
                    break;
                case DiagnosticTestScaleType.Set:
                    testResult = new SetDiagnosticTestResult();
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
            serializer.Populate(jObject.CreateReader(), testResult);
            return testResult;
        }
    }
}
