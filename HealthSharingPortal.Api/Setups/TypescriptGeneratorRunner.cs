using System;
using System.IO;
using System.Reflection;
using Commons.Physics;
using HealthModels;
using HealthModels.Attributes;
using HealthModels.Converters;
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
                .IncludeAllInNamespace(Assembly.GetAssembly(typeof(StudyParticipation)), "HealthSharingPortal.API.Models")
                .IncludeAllInNamespace(Assembly.GetAssembly(typeof(StudyParticipation)), "HealthSharingPortal.API.ViewModels")
                .Exclude<OfferAutocompleteAttribute>()
                .Exclude<DiagnosticCriteriaJsonConverter>()
                .Exclude<DiagnosticTestResultJsonConverter>()
                .Exclude<DiseaseJsonConverter>()
                .Exclude<ObservationsJsonConverter>()
                .Exclude<ObservationsJsonConverter>()
                .Exclude<SymptomJsonConverter>()
                .Exclude<ServiceAudienceJsonConverter>()
                .Exclude<ServiceParameterJsonConverter>()
                .Exclude<ServiceParameterResponseJsonConverter>()
                .ReactDefaults()
                .ConfigureNamespace("HealthModels", options => options.Translation = "Models")
                .ConfigureNamespace("HealthSharingPortal.API.Models", options => options.Translation = "Models")
                .ConfigureNamespace("HealthSharingPortal.API.ViewModels", options =>
                {
                    options.Translation = "ViewModels";
                    options.Filename = "viewModels.d.ts";
                })
                .CustomizeType(x => x == typeof(UnitValue), _ => "math.Unit")
                .CustomizeType(x => x == typeof(Guid), _ => "string")
                .SetOutputDirectory(Path.Combine(repositoryPath, "health-sharing-portal", "src", "localComponents", "types"))
                .Generate();
        }
    }
}
