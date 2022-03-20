using System.Collections.Generic;

namespace HealthSharingPortal.API.Models
{
    public class ResearchStaff
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string OrcId { get; set; }
        public List<string> Organizations { get; set; }
    }
}