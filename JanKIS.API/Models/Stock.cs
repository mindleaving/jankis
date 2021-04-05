using JanKIS.API.Storage;

namespace JanKIS.API.Models
{
    public class Stock : IId
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public LocationReference Location { get; set; }
        public string DepartmentId { get; set; }
    }
}