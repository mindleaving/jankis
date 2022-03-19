using System;
using System.Collections.Generic;
using HealthModels;

namespace HealthSharingPortal.API.Models
{
    public class Publication : IId
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Abstract { get; set; }
        public List<Author> Authors { get; set; }
        public string Journal { get; set; }
        public DateTime PublicationDate { get; set; }
    }
}
