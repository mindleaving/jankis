using JanKIS.API.Storage;
using TypescriptGenerator.Attributes;

namespace JanKIS.API.Models
{
    public class ResourceGroup : IId
    {
        public string Id { get; set; }
        public string Name { get; set; }
        [TypescriptIsOptional]
        public string ParentGroup { get; set; }
    }
}
