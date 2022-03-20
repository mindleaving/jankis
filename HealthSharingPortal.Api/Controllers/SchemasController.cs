using System;
using System.Collections.Generic;
using System.Linq;
using HealthModels;
using HealthSharingPortal.API.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
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
                typeof(Person)
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
                SerializerSettings = new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                }
            });
            var serializedSchema = jsonSchema.ToJson(Formatting.Indented);
            return Ok(serializedSchema);
            //return Ok(jsonSchema); // BUG: .items of array proeprties is empty
        }

    }
}
