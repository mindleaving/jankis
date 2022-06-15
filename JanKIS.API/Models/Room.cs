using System.Collections.Generic;
using HealthModels;

namespace JanKIS.API.Models
{
    public class Room : IId
    {
        public Room()
        {
        }
        public Room(
            string id,
            string name,
            List<string> bedPositions,
            string institutionId)
        {
            Id = id;
            Name = name;
            BedPositions = bedPositions;
            InstitutionId = institutionId;
        }

        public string Id { get; set; }
        public string Name { get; set; }
        public List<string> BedPositions { get; set; }
        public string InstitutionId { get; set; }
    }
}