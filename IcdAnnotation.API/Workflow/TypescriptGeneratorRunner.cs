using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using Commons.Physics;
using HealthModels;
using HealthModels.Icd.Annotation;
using IcdAnnotation.API.Models;
using TypescriptGenerator;

namespace IcdAnnotation.API.Workflow
{
    public static class TypescriptGeneratorRunner
    {
        public static void Generate()
        {
            var repositoryPath = Constants.GetRepositoryPath();
            TypescriptGenerator.TypescriptGenerator
                .Builder
                .IncludeAllInNamespace(Assembly.GetAssembly(typeof(Disease)), "HealthModels")
                .IncludeAllInNamespace(Assembly.GetAssembly(typeof(Patient)), "IcdAnnotation.API.Models")
                .ReactDefaults()
                .ConfigureNamespace("HealthModels", options => options.Translation = "Models")
                .ConfigureNamespace("IcdAnnotation.API.Models", options => options.Translation = "Models")
                .CustomizeType(x => x == typeof(UnitValue), x => "math.Unit")
                .CustomizeType(x => x == typeof(Guid), x => "string")
                .SetOutputDirectory(Path.Combine(repositoryPath, "icd-annotation-frontend", "src", "types"))
                .Generate();
        }
    }
}
