using JanKIS.API.Storage;

namespace JanKIS.API.Models
{
    public class Room : IId
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }
}