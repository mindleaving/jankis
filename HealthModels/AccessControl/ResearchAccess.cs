using System;
using System.Collections.Generic;

namespace HealthModels.AccessControl
{
    public class ResearchAccess : ISharedAccess
    {
        public string Id { get; set; }
        public SharedAccessType Type => SharedAccessType.Research;
        public string RequesterId { get; set; }
        public string TargetPersonId { get; set; }
        public string StudyId { get; set; }
        public List<IAccessFilter> AccessFilters { get; set; }
        public DateTime AccessGrantedTimestamp { get; set; }
        public DateTime? AccessEndTimestamp { get; set; }
        public bool IsRevoked { get; set; }
        
    }
}
