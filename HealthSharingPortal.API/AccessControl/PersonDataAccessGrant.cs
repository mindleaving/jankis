using System.Collections.Generic;
using System.Linq;
using HealthModels.AccessControl;

namespace HealthSharingPortal.API.AccessControl
{
    public class PersonDataAccessGrant : IPersonDataAccessGrant
    {
        public PersonDataAccessGrant(
            string personId,
            IList<AccessPermissions> permissions)
        {
            PersonId = personId;
            Permissions = permissions;
        }

        public string PersonId { get; }
        public bool HasAnyPermissions => Permissions.Any(x => x != AccessPermissions.None);
        public IList<AccessPermissions> Permissions { get; }
    }
}