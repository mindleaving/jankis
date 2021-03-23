using System.Collections.Generic;
using JanKIS.API.Storage;

namespace JanKIS.API.Models
{
    public class ServiceDefinition : IId
    {
        public string Id { get; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<SeriveParameter> Parameters { get; set; }
        public string DepartmentId { get; set; }
        public List<ServiceAudience> Audience { get; set; }
    }
}