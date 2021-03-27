using JanKIS.API.Storage;

namespace JanKIS.API.Models
{
    public class Department : IId
    {
        public string Id { get; }
        public string Name { get; set; }
        public string ParentDepartment { get; set; }
    }
}
