using System;

namespace HealthModels.AccessControl
{
    public class HealthProfessionalAccess : ISharedAccess
    {
        public string Id { get; set; }
        public SharedAccessType Type => SharedAccessType.HealthProfessional;
        public string RequesterId { get; set; }
        public string TargetPersonId { get; set; }
        public DateTime AccessGrantedTimestamp { get; set; }
        public DateTime? AccessEndTimestamp { get; set; }
        public bool IsRevoked { get; set; }
    }
}