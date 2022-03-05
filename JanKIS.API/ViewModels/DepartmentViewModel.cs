using HealthModels;
using JanKIS.API.Helpers;
using JanKIS.API.Models;
using TypescriptGenerator.Attributes;

namespace JanKIS.API.ViewModels
{
    public class DepartmentViewModel : Department, IViewModel<Department>
    {
        public DepartmentViewModel(Department model)
            : base(model.Id, model.Name, model.InstitutionId, model.ParentDepartmentId, model.RoomIds)
        {
        }

        [TypescriptIsOptional]
        public DepartmentViewModel ParentDepartment { get; set; }
    }
}