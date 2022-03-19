using System;

namespace HealthModels.AccessControl
{
    public interface IAccessRequest : IId
    {
        SharedAccessType Type { get; }
        string AccessReceiverUsername { get; }
        string SharerPersonId { get; }
        DateTime CreatedTimestamp { get; }
        bool IsCompleted { get; set; }
        DateTime? CompletedTimestamp { get; set; }
        public bool IsRevoked { get; set; }
        DateTime? RevokedTimestamp { get; set; }
    }
}