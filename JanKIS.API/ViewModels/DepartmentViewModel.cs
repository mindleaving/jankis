using System.Collections.Generic;
using HealthModels;
using HealthSharingPortal.API.ViewModels;
using Newtonsoft.Json;
using TypescriptGenerator.Attributes;

namespace JanKIS.API.ViewModels
{
    public class DepartmentViewModel : Department, IViewModel<Department>
    {
        public DepartmentViewModel(Department model)
            : base(model.Id, model.Name, model.InstitutionId, model.ParentDepartmentId, model.RoomIds)
        {
        }
        [JsonConstructor]
        public DepartmentViewModel(
            string id,
            string name,
            string institutionId,
            string parentDepartmentId,
            List<string> roomIds)
        : base(id, name, institutionId, parentDepartmentId, roomIds) {}

        [TypescriptIsOptional]
        public DepartmentViewModel ParentDepartment { get; set; }

        public Department ToModel()
        {
            return new Department(
                Id,
                Name,
                InstitutionId,
                ParentDepartmentId,
                RoomIds);
        }
    }
}