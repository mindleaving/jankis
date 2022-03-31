using System.Collections.Generic;
using HealthModels;
using HealthSharingPortal.API.ViewModels;
using JanKIS.API.Models;
using Newtonsoft.Json;

namespace JanKIS.API.ViewModels
{
    public class InstitutionViewModel : Institution, IViewModel<Institution>
    {
        public InstitutionViewModel(Institution model)
            : base(model.Id, model.Name, model.DepartmentIds, model.RoomIds)
        {
        }
        [JsonConstructor]
        public InstitutionViewModel(
            string id, 
            string name, 
            List<string> departmentIds, 
            List<string> roomIds) 
        : base(id, name, departmentIds, roomIds) {}

        public List<Room> Rooms { get; set; }
        public List<DepartmentViewModel> Departments { get; set; }
    }
}
