using System;
using JanKIS.API.Storage;
using TypescriptGenerator.Attributes;

namespace JanKIS.API.Models
{
    /// <summary>
    /// One Resource-object represents exactly one physical object, e.g. a bed, IV-pole, etc.
    /// </summary>
    public class Resource : IId
    {
        public Resource() {}
        public Resource(
            string id,
            string name,
            string groupName,
            LocationReference location,
            string note)
        {
            Id = id;
            Name = name;
            GroupName = groupName;
            Location = location;
            Note = note;
        }

        public string Id { get; set; }
        public string Name { get; set; }
        [TypescriptIsOptional]
        public LocationReference Location { get; set; }
        [TypescriptIsOptional]
        public string GroupName { get; set; }
        public string Note { get; set; }
    }
}