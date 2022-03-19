using System;

namespace HealthModels.AccessControl
{
    public class EmergencyAccess : ISharedAccess
    {
        public string Id { get; set; }
        public SharedAccessType Type => SharedAccessType.Emergency;
        public string AccessReceiverUsername { get; set; }
        public string SharerPersonId { get; set; }
        public DateTime AccessGrantedTimestamp { get; set; }
        public DateTime? AccessEndTimestamp { get; set; }
        public bool IsRevoked { get; set; }
    }
}
