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
        public string ParentDepartmentId { get; set; }

        public List<string> RoomIds { get; set; }
    }
}
