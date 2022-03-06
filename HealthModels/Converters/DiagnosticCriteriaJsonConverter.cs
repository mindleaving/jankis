using System;
using System.IO;
using HealthModels.DiagnosticTestResults;
using HealthModels.Extensions;
using HealthModels.Icd.Annotation.Diagnostics;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace HealthModels.Converters
{
    public class DiagnosticCriteriaJsonConverter : JsonConverter<IDiagnosticCriteria>
    {
        public override bool CanWrite => false;

        public override IDiagnosticCriteria ReadJson(
            JsonReader reader,
            Type objectType,
            IDiagnosticCriteria existingValue,
            bool hasExistingValue,
            JsonSerializer serializer)
        {
            var jObject = JObject.Load(reader);

            var scaleType = jObject.GetValueCaseInsensitive<DiagnosticTestScaleType>(nameof(IDiagnosticCriteria.ScaleType));
            DiagnosticCriteria diagnosticCriteria;
            switch (scaleType)
            {
                case DiagnosticTestScaleType.Undefined:
                    throw new InvalidDataException($"Scale type of diagnostic criteria must not be '{scaleType}'");
                case DiagnosticTestScaleType.Quantitative:
                    diagnosticCriteria = new QuantativeDiagnosticCriteria();
                    break;
                case DiagnosticTestScaleType.Ordinal:
                    diagnosticCriteria = new OrdinalDiagnosticCriteria();
                    break;
                case DiagnosticTestScaleType.OrdinalOrQuantitative:
                    diagnosticCriteria = new OrdinalQuantativeDiagnosticCriteria();
                    break;
                case DiagnosticTestScaleType.Nominal:
                    diagnosticCriteria = new NominalDiagnosticCriteria();
                    break;
                case DiagnosticTestScaleType.Freetext:
                    diagnosticCriteria = new FreetextDiagnosticCriteria();
                    break;
                case DiagnosticTestScaleType.Document:
                    diagnosticCriteria = new DocumentDiagnosticCriteria();
                    break;
                case DiagnosticTestScaleType.Set:
                    diagnosticCriteria = new SetDiagnosticCriteria();
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            serializer.Populate(jObject.CreateReader(), diagnosticCriteria);

            return diagnosticCriteria;
        }

        public override void WriteJson(
            JsonWriter writer,
            IDiagnosticCriteria value,
            JsonSerializer serializer)
        {
            throw new NotSupportedException();
        }
    }
}
