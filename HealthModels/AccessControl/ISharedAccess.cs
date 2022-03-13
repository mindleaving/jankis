using System;

namespace HealthModels.AccessControl
{
    public interface ISharedAccess : IId
    {
        SharedAccessType Type { get; }
        string RequesterId { get; }
        string TargetPersonId { get; }
        DateTime AccessGrantedTimestamp { get; }
        DateTime? AccessEndTimestamp { get; set; }
        bool IsRevoked { get; set; }
    }
}