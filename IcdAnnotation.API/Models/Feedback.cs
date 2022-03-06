using System;
using HealthModels;
using TypescriptGenerator.Attributes;

namespace IcdAnnotation.API.Models
{
    public class Feedback : IId
    {
        [TypescriptIsOptional]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [TypescriptIsOptional]
        public DateTime CreatedTimestamp { get; set; } = DateTime.UtcNow;
        public string Url { get; set; }
        public string Message { get; set; }
    }
}
