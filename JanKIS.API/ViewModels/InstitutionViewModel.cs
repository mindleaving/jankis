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
            : base(model.Id, model.Name)
        {
        }
        [JsonConstructor]
        public InstitutionViewModel(
            string id, 
            string name) 
        : base(id, name) {}

        public List<Room> Rooms { get; set; }
        public List<DepartmentViewModel> Departments { get; set; }
    }
}
