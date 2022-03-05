using System.Collections.Generic;
using HealthModels;
using JanKIS.API.Storage;

namespace JanKIS.API.Models
{
    public class Room : IId
    {
        public Room() {}
        public Room(
            string id,
            string name,
            List<string> bedPositions)
        {
            Id = id;
            Name = name;
            BedPositions = bedPositions;
        }

        public string Id { get; set; }
        public string Name { get; set; }
        public List<string> BedPositions { get; set; }
    }
}