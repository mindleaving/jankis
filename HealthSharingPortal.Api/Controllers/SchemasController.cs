using System;
using System.Collections.Generic;
using System.Linq;
using HealthModels;
using HealthModels.Diagnoses;
using HealthModels.Interview;
using HealthModels.Medication;
using HealthModels.Procedures;
using HealthSharingPortal.API.Models;
using HealthSharingPortal.API.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using NJsonSchema;
using NJsonSchema.Generation;

namespace HealthSharingPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SchemasController : ControllerBase
    {
        private readonly Dictionary<string, Type> exposedTypes = new[]
            {
                typeof(Study),
                typeof(Publication),
                typeof(Contact),
                typeof(Account),
                typeof(HealthProfessionalAccount),
                typeof(Person),
                typeof(Questionnaire),
                typeof(Diagnosis),
                typeof(Immunization),
                typeof(MedicalProcedure),
                typeof(PastMedicationViewModel)
            }.ToDictionary(x => x.Name.ToLower(), x => x);

        [HttpGet("{typeName}")]
        public IActionResult GetSchemaForType([FromRoute] string typeName)
        {
            var lowerTypeName = typeName.ToLower();
            if (!exposedTypes.ContainsKey(lowerTypeName))
                return NotFound();
            var type = exposedTypes[lowerTypeName];
            var jsonSchema = JsonSchema.FromType(type, new JsonSchemaGeneratorSettings
            {
                AlwaysAllowAdditionalObjectProperties = true,
                SerializerSettings = new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver(),
                    Converters = { new StringEnumConverter() }
                }
            });
            var serializedSchema = jsonSchema.ToJson(Formatting.Indented);
            return Ok(serializedSchema);
            //return Ok(jsonSchema); // BUG: .items of array proeprties is empty
        }

    }
}
