using HealthModels;
using JanKIS.API.Storage;

namespace JanKIS.API.Models
{
    public class Stock : IId
    {
        public Stock() {}

        public Stock(
            string id,
            string name,
            string departmentId,
            LocationReference location)
        {
            Id = id;
            Name = name;
            DepartmentId = departmentId;
            Location = location;
        }
        public string Id { get; set; }
        public string Name { get; set; }
        public LocationReference Location { get; set; }
        public string DepartmentId { get; set; }
    }
}