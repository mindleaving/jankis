using System.Collections.Generic;
using JanKIS.API.Storage;

namespace JanKIS.API.Models
{
    public class Ward : IId
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string InstitutionId { get; set; }
        public List<Room> Rooms { get; set; }
    }
}