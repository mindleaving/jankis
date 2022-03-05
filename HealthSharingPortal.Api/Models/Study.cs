using System.Collections.Generic;
using HealthModels;

namespace HealthSharingPortal.Api.Models
{
    public class Study : IId
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public List<Contact> ContactPersons { get; set; }
    }
}
