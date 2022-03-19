﻿using System;

namespace HealthModels.AccessControl
{
    public class HealthProfessionalAccessInvite : IAccessRequest
    {
        public string Id { get; set; }
        public SharedAccessType Type => SharedAccessType.HealthProfessional;
        public string AccessReceiverUsername { get; set; }
        public string SharerPersonId { get; set; }
        public DateTime CreatedTimestamp { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? CompletedTimestamp { get; set; }
        public string CodeForSharer { get; set; }
        public string CodeForHealthProfessional { get; set; }
        public bool SharerHasAccepted { get; set; }
        public DateTime? SharerHasAcceptedTimestamp { get; set; }
        public bool HealthProfessionalHasAccepted { get; set; }
        public DateTime? HealthProfessionalHasAcceptedTimestamp { get; set; }
        public bool IsRevoked { get; set; }
        public DateTime? RevokedTimestamp { get; set; }
        public bool IsRejected { get; set; }
        public DateTime? RejectedTimestamp { get; set; }
    }
}
