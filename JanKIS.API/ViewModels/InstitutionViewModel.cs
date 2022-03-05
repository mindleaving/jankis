using System.Collections.Generic;
using HealthModels;
using JanKIS.API.Models;

namespace JanKIS.API.ViewModels
{
    public class InstitutionViewModel : Institution, IViewModel<Institution>
    {
        public InstitutionViewModel(Institution model)
            : base(model.Id, model.Name, model.DepartmentIds, model.RoomIds)
        {
        }

        public List<Room> Rooms { get; set; }
        public List<DepartmentViewModel> Departments { get; set; }
    }
}
