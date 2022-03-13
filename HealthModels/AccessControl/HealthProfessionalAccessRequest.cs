using System;
using Newtonsoft.Json;

namespace HealthModels.AccessControl
{
    public class HealthProfessionalAccessRequest : IAccessRequest
    {
        public string Id { get; set; }
        public SharedAccessType Type => SharedAccessType.HealthProfessional;
        public string RequesterId { get; set; }
        public string TargetPersonId { get; set; }
        public DateTime CreatedTimestamp { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? CompletedTimestamp { get; set; }
        [JsonIgnore]
        public string CodeForSharer { get; set; }
        [JsonIgnore]
        public string CodeForHealthProfessional { get; set; }
    }
}
