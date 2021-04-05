﻿using System.Collections.Generic;
using JanKIS.API.Storage;

namespace JanKIS.API.Models
{
    public class ServiceDefinition : IId
    {
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