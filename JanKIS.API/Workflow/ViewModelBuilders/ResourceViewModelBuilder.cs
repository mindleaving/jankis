using System.Collections.Generic;
using System.Threading.Tasks;
using JanKIS.API.Models;
using JanKIS.API.ViewModels;

namespace JanKIS.API.Workflow.ViewModelBuilders
{
    public class ResourceViewModelBuilder : IViewModelBuilder<Resource>
    {
        private readonly IViewModelBuilder<LocationReference> locationViewModelBuilder;

        public ResourceViewModelBuilder(IViewModelBuilder<LocationReference> locationViewModelBuilder)
        {
            this.locationViewModelBuilder = locationViewModelBuilder;
        }

        public async Task<IViewModel<Resource>> Build(Resource model, IViewModelBuilderOptions<Resource> options = null)
        {
            var locationViewModel = model.Location != null
                ? await locationViewModelBuilder.Build(model.Location)
                : null;
            return new ResourceViewModel(model)
            {
                LocationViewModel = (LocationViewModel) locationViewModel
            };
        }

        public Task<List<IViewModel<Resource>>> BatchBuild(
            List<Resource> models,
            IViewModelBuilderOptions<Resource> options = null)
        {
            throw new System.NotImplementedException();
        }
    }
}
