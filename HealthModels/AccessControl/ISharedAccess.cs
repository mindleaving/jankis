using System;

namespace HealthModels.AccessControl
{
    public interface ISharedAccess : IId
    {
        SharedAccessType Type { get; }
        string AccessReceiverUsername { get; }
        string SharerPersonId { get; }
        DateTime AccessGrantedTimestamp { get; }
        DateTime? AccessEndTimestamp { get; set; }
        bool IsRevoked { get; set; }
    }
}