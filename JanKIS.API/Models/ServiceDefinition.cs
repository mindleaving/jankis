using System.Collections.Generic;
using HealthModels;
using JanKIS.API.Storage;

namespace JanKIS.API.Models
{
    public class ServiceDefinition : IId
    {
        public ServiceDefinition() {}
        public ServiceDefinition(
            string id,
            string name,
            string description,
            string departmentId,
            List<ServiceParameter> parameters,
            List<ServiceAudience> audience,
            bool autoAcceptRequests,
            bool isAvailable)
        {
            Id = id;
            Name = name;
            Description = description;
            DepartmentId = departmentId;
            Parameters = parameters;
            Audience = audience;
            AutoAcceptRequests = autoAcceptRequests;
            IsAvailable = isAvailable;
        }

        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<ServiceParameter> Parameters { get; set; }
        public List<ServiceAudience> Audience { get; set; }
        public string DepartmentId { get; set; }
        public bool AutoAcceptRequests { get; set; }
        public bool IsAvailable { get; set; }
    }
}