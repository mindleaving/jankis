using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace HealthModels.AccessControl
{
    public class ResearchAccessRequest : IAccessRequest
    {
        public string Id { get; }
        public SharedAccessType Type => SharedAccessType.Research;
        public string RequesterId { get; set; }
        public string TargetPersonId { get; set; }
        public DateTime CreatedTimestamp { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? CompletedTimestamp { get; set; }
        public string StudyId { get; set; }
        public List<IAccessFilter> AccessFilters { get; set; }
        [JsonIgnore]
        public string CodeForSharer { get; set; }
        [JsonIgnore]
        public string CodeForResearcher { get; set; }
    }
}
