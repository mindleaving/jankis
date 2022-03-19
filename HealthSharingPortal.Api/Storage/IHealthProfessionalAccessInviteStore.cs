using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using HealthModels.AccessControl;
using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.Storage
{
    public interface IHealthProfessionalAccessInviteStore
    {
        Task<string> CreateNew(string accessReceiverUsername, string sharerPersonId);
        Task<bool> SetSharerHasAccepted(string inviteId);
        Task<bool> SetHealthProfessionalHasAccepted(string inviteId);
        Task<bool> Revoke(string inviteId);
        Task<bool> Reject(string inviteId);

        Task<HealthProfessionalAccessInvite> GetByIdAndRemoveCode(string inviteId, AccountType requesterAccountType);
        Task<IEnumerable<HealthProfessionalAccessInvite>> SearchAsync(Expression<Func<HealthProfessionalAccessInvite, bool>> filter, AccountType requesterAccountType);

        Task<bool> CheckCodeFromSharer(string inviteId, string codeForSharer);
        Task<bool> CheckCodeFromHealthProfessional(string inviteId, string codeForHealthProfessional);
        Task<bool> TryMarkAsCompleted(string inviteId);
    }
}
