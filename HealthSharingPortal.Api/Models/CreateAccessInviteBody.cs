using System.Collections.Generic;
using HealthModels.AccessControl;

namespace HealthSharingPortal.API.Models
{
    public class CreateAccessInviteBody
    {
        public string HealthProfessionalAccountId { get; set; }
        /// <summary>
        /// Duration in ISO 8601-format. Put time-separator 'T' in front of time.
        /// </summary>
        public string ExpirationDuration { get; set; }
        public List<AccessPermissions> Permissions { get; set; }
    }
}
