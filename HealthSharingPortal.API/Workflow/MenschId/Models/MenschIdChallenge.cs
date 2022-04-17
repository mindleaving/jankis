using System;

namespace HealthSharingPortal.API.Workflow.MenschId.Models
{
    public class MenschIdChallenge
    {
        public string Id { get; set; }
        public string MenschId { get; set; }
        public string ChallengeShortId { get; set; }
        public string ChallengeSecret { get; set; }
        public DateTime CreatedTimestamp { get; set; }
    }
}
