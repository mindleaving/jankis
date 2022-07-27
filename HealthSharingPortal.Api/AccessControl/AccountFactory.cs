using System;
using HealthSharingPortal.API.Models;

namespace HealthSharingPortal.API.AccessControl
{
    public static class AccountFactory
    {
        public static Account Create(
            AccountType accountType,
            string loginId,
            string personId = null)
        {
            if (loginId == null) 
                throw new ArgumentNullException(nameof(loginId), "An account must be linked to a login");
            var accountId = Guid.NewGuid().ToString();
            var account = accountType switch
            {
                AccountType.Sharer => new SharerAccount(accountId, personId),
                AccountType.HealthProfessional => new HealthProfessionalAccount(accountId, personId),
                AccountType.Researcher => new ResearcherAccount(accountId, personId),
                AccountType.EmergencyGuest => throw new InvalidOperationException("Emergency guests don't get accounts"),
                AccountType.Admin => new Account(accountId, accountType),
                _ => throw new ArgumentOutOfRangeException(nameof(accountType), accountType, null)
            };
            account.PersonId = personId;
            account.LoginIds.Add(loginId);
            return account;
        }
    }
}
