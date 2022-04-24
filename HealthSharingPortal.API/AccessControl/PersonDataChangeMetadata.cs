using System;

namespace HealthSharingPortal.API.AccessControl
{
    public class PersonDataChangeMetadata
    {
        public PersonDataChangeMetadata(
            string accountId,
            string personId)
        {
            AccountId = accountId ?? throw new ArgumentNullException(nameof(accountId));
            PersonId = personId ?? throw new ArgumentNullException(nameof(personId));
        }

        public string AccountId { get; }
        public string PersonId { get; }
    }
}
