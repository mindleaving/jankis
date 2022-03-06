using System;
using System.Collections.Generic;

namespace HealthSharingPortal.Api.Models
{
    public class Publication
    {
        public string Title { get; set; }
        public string Abstract { get; set; }
        public List<Author> Authors { get; set; }
        public string Journal { get; set; }
        public DateTime PublicationDate { get; set; }
    }
}
