using System;
using System.Collections.Generic;

namespace HealthModels.AccessControl
{
    public interface ISharedAccess : IId
    {
        SharedAccessType Type { get; }
        List<AccessPermissions> Permissions { get; }
        string AccessReceiverUsername { get; }
        string SharerPersonId { get; }
        DateTime AccessGrantedTimestamp { get; }
        DateTime? AccessEndTimestamp { get; set; }
        bool IsRevoked { get; set; }
    }
}