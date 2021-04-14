using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using Commons.Physics;
using JanKIS.API.Models;
using JanKIS.API.ViewModels;
using TypescriptGenerator;

namespace JanKIS.API.Workflow
{
    public static class TypescriptGeneratorRunner
    {
        private static readonly Dictionary<string, string> RepositoryPaths = new Dictionary<string, string>
        {
            {"stationary-win8", @"G:\Projects\JanKIS"}
        };

        public static void Run()
        {
            var repositoryPath = RepositoryPaths[Environment.MachineName.ToLowerInvariant()];
            TypescriptGenerator.TypescriptGenerator.Builder
                .IncludeAllInNamespace(Assembly.GetAssembly(typeof(Person)), "JanKIS.API.Models")
                .IncludeAllInNamespace(Assembly.GetAssembly(typeof(Person)), "JanKIS.API.ViewModels")
                .Exclude<Account>()
                .ReactDefaults()
                .ConfigureNamespace("JanKIS.API.Models", options => options.Translation = "Models")
                .ConfigureNamespace("JanKIS.API.ViewModels", options =>
                {
                    options.Translation = "ViewModels";
                    options.Filename = "viewModels.d.ts";
                })
                .CustomizeType(x => x == typeof(UnitValue), _ => "math.Unit")
                .CustomizeType(x => x == typeof(Guid), _ => "string")
                .SetOutputDirectory(Path.Combine(repositoryPath, @"jankis-frontend\src\types"))
                .Generate();
        }
    }
}
