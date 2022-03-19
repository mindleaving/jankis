using System;
using TypescriptGenerator.Attributes;

namespace HealthSharingPortal.API.Models.Filters
{
    public class SharedAccessFilter
    {
        [TypescriptIsOptional]
        public string SearchText { get; set; }
        [TypescriptIsOptional]
        public bool OnlyActive { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
    }
}
