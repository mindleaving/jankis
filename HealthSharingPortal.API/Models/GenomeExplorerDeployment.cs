using System.Collections.Generic;
using HealthModels;
using TypescriptGenerator.Attributes;

namespace HealthSharingPortal.API.Models
{
    public class GenomeExplorerDeployment : IPersonData
    {
        public string Id { get; set; }
        public string PersonId { get; set; }
        public List<string> ReferenceSequences { get; set; }
        public List<string> DocumentIds { get; set; }

        [TypescriptIsOptional]
        public string EnvironmentUrl { get; set; }
    }
}