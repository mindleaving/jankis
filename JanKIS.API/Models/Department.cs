using System.Collections.Generic;
using JanKIS.API.Storage;
using TypescriptGenerator.Attributes;

namespace JanKIS.API.Models
{
    public class Department : IId
    {
        public Department() {}
        public Department(
            string id,
            string name,
            string institutionId,
            string parentDepartmentId,
            List<string> roomIds)
        {
            Id = id;
            Name = name;
            InstitutionId = institutionId;
            ParentDepartmentId = parentDepartmentId;
            RoomIds = roomIds ?? new List<string>();
        }

        public string Id { get; set; }
        public string Name { get; set; }
        public string InstitutionId { get; set; }
        [TypescriptIsOptional]
        public string ParentDepartmentId { get; set; }

        public List<string> RoomIds { get; set; }
    }
}
