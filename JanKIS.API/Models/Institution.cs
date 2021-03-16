using System.Collections.Generic;

namespace JanKIS.API.Models
{
    public class Institution
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public List<Ward> Wards { get; set; }
    }
}
