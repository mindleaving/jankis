using System;
using HealthModels;

namespace HealthSharingPortal.API.AccessControl
{
    public class MenschIdChallenge : IId
    {
        public string Id { get; set; }
        public string MenschId { get; set; }
        public string LoginId { get; set; }
        public string ChallengeShortId { get; set; }
        public string ChallengeSecret { get; set; }
        public int AttemptsCount { get; set; }
        public DateTime CreatedTimestamp { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? CompletedTimestamp { get; set; }
    }
}
