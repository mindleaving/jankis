using System.Collections.Generic;

namespace JanKIS.API.Models
{
    public class ServicePackage
    {
        public string Name { get; set; }
        public List<string> ServiceIds { get; set; }
    }
}
