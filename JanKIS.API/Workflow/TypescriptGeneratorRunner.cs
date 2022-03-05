using System;
using System.IO;
using System.Reflection;
using Commons.Physics;
using HealthModels;
using JanKIS.API.Models;
using TypescriptGenerator;

namespace JanKIS.API.Workflow
{
    public static class TypescriptGeneratorRunner
    {
        public static void Run()
        {
            var repositoryPath = Constants.GetRepositoryPath();
            TypescriptGenerator.TypescriptGenerator.Builder
                .IncludeAllInNamespace(Assembly.GetAssembly(typeof(Person)), "HealthModels")
                .IncludeAllInNamespace(Assembly.GetAssembly(typeof(BedOccupancy)), "JanKIS.API.Models")
                .IncludeAllInNamespace(Assembly.GetAssembly(typeof(BedOccupancy)), "JanKIS.API.ViewModels")
                .Exclude<Account>()
                .ReactDefaults()
                .ConfigureNamespace("HealthModels", options => options.Translation = "Models")
                .ConfigureNamespace("JanKIS.API.Models", options => options.Translation = "Models")
                .ConfigureNamespace("JanKIS.API.ViewModels", options =>
                {
                    options.Translation = "ViewModels";
                    options.Filename = "viewModels.d.ts";
                })
                .CustomizeType(x => x == typeof(UnitValue), _ => "math.Unit")
                .CustomizeType(x => x == typeof(Guid), _ => "string")
                .SetOutputDirectory(Path.Combine(repositoryPath, "jankis-frontend", "src", "types"))
                .Generate();
        }
    }
}
