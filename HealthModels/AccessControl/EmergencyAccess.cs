using System;
using System.Collections.Generic;
using TypescriptGenerator.Attributes;

namespace HealthModels.AccessControl
{
    public class EmergencyAccess : ISharedAccess
    {
        public string Id { get; set; }
        [TypescriptIsOptional]
        public string Token { get; set; }
        [TypescriptIsOptional]
        public string Name { get; set; }

        public SharedAccessType Type => SharedAccessType.Emergency;
        public List<AccessPermissions> Permissions { get; set; }
        public string AccessReceiverAccountId { get; set; }
        public string SharerPersonId { get; set; }
        public DateTime AccessGrantedTimestamp { get; set; }
        public DateTime? AccessEndTimestamp { get; set; }
        public bool IsRevoked { get; set; }
    }
}
