using System.Collections.Generic;

namespace JanKIS.API.Models
{
    public class Ward
    {
        public string Id { get; set; }
        public string InstitutionId { get; set; }
        public List<Room> Rooms { get; set; }
    }
}