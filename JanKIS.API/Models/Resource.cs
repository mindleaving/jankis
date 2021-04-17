using JanKIS.API.Storage;
using TypescriptGenerator.Attributes;

namespace JanKIS.API.Models
{
    /// <summary>
    /// One Resource-object represents exactly one physical object, e.g. a bed, IV-pole, etc.
    /// </summary>
    public class Resource : IId
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public LocationReference Location { get; set; }
        [TypescriptIsOptional]
        public string GroupId { get; set; }
        public string Note { get; set; }
    }
}