using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using HealthModels;
using HealthSharingPortal.Api.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NUnit.Framework;

namespace HealthSharingPortal.Tools
{
    public class LocalizationStringSearcher
    {
        private readonly string FrontendDirectory = Path.Combine(Constants.GetRepositoryPath(), "health-sharing-portal");

        [Test]
        public void CreateLocalizationIdDictionary()
        {
            
            var localizationOutputFile = Path.Combine(FrontendDirectory, "src", "resources", "translation.en.json");
            var tsFiles = Directory.GetFiles(Path.Combine(FrontendDirectory, "src"), "*.ts?", SearchOption.AllDirectories);
            var existingLocalizations = JObject.Parse(File.ReadAllText(localizationOutputFile));
            var existingResourceIds = existingLocalizations.Properties().Select(x => x.Name);
            var enumResourceIds = GetEnumResourceIds();
            var resourceIds = new List<string>(existingResourceIds.Concat(enumResourceIds));
            foreach (var tsFile in tsFiles)
            {
                var fileContent = File.ReadAllLines(tsFile);
                foreach (var line in fileContent)
                {
                    var matches = Regex.Matches(line, "resolveText\\([\"'](?<ResourceID>[^\"']+)[\"']\\)");
                    foreach (Match match in matches)
                    {
                        if(!match.Groups["ResourceID"].Success)
                            continue;
                        var resourceId = match.Groups["ResourceID"].Value;
                        resourceIds.Add(resourceId);
                    }
                }
            }

            var resourceDictionary = new JObject();
            foreach (var resourceId in resourceIds.Distinct().OrderBy(x => x))
            {
                var existingValue = existingLocalizations[resourceId]?.Value<string>();
                resourceDictionary[resourceId] = existingValue ?? "";
                Console.WriteLine($"{resourceId}: {existingValue}");
            }

            File.WriteAllText(localizationOutputFile, JsonConvert.SerializeObject(resourceDictionary, Formatting.Indented));
        }

        [Test]
        [TestCase("de")]
        public void CreateLocalizationsIdsInSecondaryDictionaries(string language)
        {
            var primaryLanguage = "en";
            var primaryDictionaryFile = Path.Combine(
                FrontendDirectory,
                "src", "resources",
                $"translation.{primaryLanguage}.json");
            var secondaryDictionaryFile = Path.Combine(
                FrontendDirectory,
                "src", "resources",
                $"translation.{language}.json");
            var primaryJObject = JObject.Parse(File.ReadAllText(primaryDictionaryFile));
            var secondaryJObject = JObject.Parse(File.ReadAllText(secondaryDictionaryFile));
            foreach (var resourceId in primaryJObject.Properties().Select(x => x.Name))
            {
                if(secondaryJObject.ContainsKey(resourceId))
                    continue;
                secondaryJObject[resourceId] = "";
            }
            File.WriteAllText(secondaryDictionaryFile, JsonConvert.SerializeObject(secondaryJObject, Formatting.Indented));


        }

        private static IEnumerable<string> GetEnumResourceIds()
        {
            var enumResourceIds = Assembly.GetAssembly(typeof(AccountType))
                .GetExportedTypes()
                .Where(t => t.Namespace.StartsWith(typeof(AccountType).Namespace) && t.IsEnum)
                .SelectMany(t => Enum.GetNames(t).Select(x => $"{t.Name}_{x}"));
            return enumResourceIds;
        }
    }
}
