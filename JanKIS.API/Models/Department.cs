using System.Collections.Generic;
using JanKIS.API.Storage;
using TypescriptGenerator.Attributes;

namespace JanKIS.API.Models
{
    public class Department : IId
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string InstitutionId { get; set; }
        [TypescriptIsOptional]
        public string ParentDepartment { get; set; }

        public List<Room> Rooms { get; set; }
    }
}
