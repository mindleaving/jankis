using System;
using System.Collections.Generic;
using TypescriptGenerator.Attributes;

namespace HealthModels.AccessControl
{
    public interface ISharedAccess : IId
    {
        SharedAccessType Type { get; }
        List<AccessPermissions> Permissions { get; }
        [TypescriptIsOptional]
        string AccessReceiverAccountId { get; }
        string SharerPersonId { get; }
        DateTime AccessGrantedTimestamp { get; }
        DateTime? AccessEndTimestamp { get; set; }
        bool IsRevoked { get; set; }
    }
}