using System;
using System.Collections.Generic;

namespace HealthModels.AccessControl
{
    public class HealthProfessionalAccess : ISharedAccess
    {
        public string Id { get; set; }
        public SharedAccessType Type => SharedAccessType.HealthProfessional;
        public List<AccessPermissions> Permissions { get; set; }
        public string AccessReceiverUsername { get; set; }
        public string SharerPersonId { get; set; }
        public DateTime AccessGrantedTimestamp { get; set; }
        public DateTime? AccessEndTimestamp { get; set; }
        public bool IsRevoked { get; set; }
    }
}