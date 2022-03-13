using System;

namespace HealthModels.AccessControl
{
    public interface IAccessRequest : IId
    {
        SharedAccessType Type { get; }
        string RequesterId { get; }
        string TargetPersonId { get; }
        DateTime CreatedTimestamp { get; }
        bool IsCompleted { get; set; }
        DateTime? CompletedTimestamp { get; }
    }
}