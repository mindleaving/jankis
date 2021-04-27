using JanKIS.API.Models;
using TypescriptGenerator.Attributes;

namespace JanKIS.API.ViewModels
{
    public class LocationViewModel : LocationReference, IViewModel<LocationReference>
    {
        public LocationViewModel(LocationReference model)
            : base(model.Type, model.Id)
        {
        }

        [TypescriptIsOptional]
        public DepartmentViewModel Department { get; set; }
        [TypescriptIsOptional]
        public Room Room { get; set; }
    }
}
