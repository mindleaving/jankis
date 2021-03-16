using System.Collections.Generic;

namespace JanKIS.API.Models
{
    public class Room
    {
        public string Id { get; set; }
        public string WardId { get; set; }
        public List<Bed> Beds { get; set; }
    }
}