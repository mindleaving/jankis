using System.Collections.Generic;
using HealthModels.AccessControl;

namespace HealthSharingPortal.API.AccessControl
{
    public static class AccessGrantHelpers
    {
        public static List<IPersonDataAccessGrant> GrantForPersonWithPermission(
            string personId,
            params AccessPermissions[] permissions)
        {
            return new List<IPersonDataAccessGrant>
            {
                new PersonDataAccessGrant(personId, permissions)
            };
        }

        public static List<IPersonDataAccessGrant> GrantReadAccessToAllPersons()
        {
            return new List<IPersonDataAccessGrant>
            {
                new ReadAnyPersonDataAccessGrant()
            };
        }
    }
}
