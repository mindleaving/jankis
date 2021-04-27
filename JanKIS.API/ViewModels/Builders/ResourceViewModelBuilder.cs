using System.Threading.Tasks;
using JanKIS.API.Models;

namespace JanKIS.API.ViewModels.Builders
{
    public class ResourceViewModelBuilder : IViewModelBuilder<Resource>
    {
        private readonly IViewModelBuilder<LocationReference> locationViewModelBuilder;

        public ResourceViewModelBuilder(IViewModelBuilder<LocationReference> locationViewModelBuilder)
        {
            this.locationViewModelBuilder = locationViewModelBuilder;
        }

        public async Task<IViewModel<Resource>> Build(Resource model)
        {
            var locationViewModel = model.Location != null
                ? await locationViewModelBuilder.Build(model.Location)
                : null;
            return new ResourceViewModel(model)
            {
                LocationViewModel = (LocationViewModel) locationViewModel
            };
        }
    }
}
