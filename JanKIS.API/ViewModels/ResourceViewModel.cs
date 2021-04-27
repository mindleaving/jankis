using JanKIS.API.Models;
using TypescriptGenerator.Attributes;

namespace JanKIS.API.ViewModels
{
    public class ResourceViewModel : Resource, IViewModel<Resource>
    {
        public ResourceViewModel(Resource model)
            : base(
                model.Id,
                model.Name,
                model.GroupName,
                model.Location,
                model.Note)
        {
        }

        [TypescriptIsOptional]
        public LocationViewModel LocationViewModel { get; set; }
    }
}
