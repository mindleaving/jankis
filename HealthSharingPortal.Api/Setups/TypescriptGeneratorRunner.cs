using System;
using System.IO;
using System.Reflection;
using Commons.Physics;
using HealthModels;
using HealthSharingPortal.API.Models;
using TypescriptGenerator;

namespace HealthSharingPortal.API.Setups
{
    public static class TypescriptGeneratorRunner
    {
        public static void Run()
        {
            var repositoryPath = Constants.GetRepositoryPath();
            TypescriptGenerator.TypescriptGenerator.Builder
                .IncludeAllInNamespace(Assembly.GetAssembly(typeof(Person)), "HealthModels")
                .IncludeAllInNamespace(Assembly.GetAssembly(typeof(StudyParticipation)), "HealthSharingPortal.Api.Models")
                .IncludeAllInNamespace(Assembly.GetAssembly(typeof(StudyParticipation)), "HealthSharingPortal.Api.ViewModels")
                .ReactDefaults()
                .ConfigureNamespace("HealthModels", options => options.Translation = "Models")
                .ConfigureNamespace("HealthSharingPortal.Api.Models", options => options.Translation = "Models")
                .ConfigureNamespace("HealthSharingPortal.Api.ViewModels", options =>
                {
                    options.Translation = "ViewModels";
                    options.Filename = "viewModels.d.ts";
                })
                .CustomizeType(x => x == typeof(UnitValue), _ => "math.Unit")
                .CustomizeType(x => x == typeof(Guid), _ => "string")
                .SetOutputDirectory(Path.Combine(repositoryPath, "health-sharing-portal", "src", "types"))
                .Generate();
        }
    }
}
