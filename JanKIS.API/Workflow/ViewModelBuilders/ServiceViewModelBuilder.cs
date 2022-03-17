using System.Collections.Generic;
using System.Threading.Tasks;
using HealthModels;
using HealthModels.Services;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using JanKIS.API.ViewModels;

namespace JanKIS.API.Workflow.ViewModelBuilders
{
    public class ServiceViewModelBuilder : IViewModelBuilder<ServiceDefinition>
    {
        private readonly ICachedReadonlyStore<Department> departmentsStore;
        private readonly IViewModelBuilder<Department> departmentViewModelBuilder;
        private readonly IViewModelBuilder<ServiceAudience> serviceAudienceViewModelBuilder;

        public ServiceViewModelBuilder(
            ICachedReadonlyStore<Department> departmentsStore,
            IViewModelBuilder<Department> departmentViewModelBuilder,
            IViewModelBuilder<ServiceAudience> serviceAudienceViewModelBuilder)
        {
            this.departmentsStore = departmentsStore;
            this.departmentViewModelBuilder = departmentViewModelBuilder;
            this.serviceAudienceViewModelBuilder = serviceAudienceViewModelBuilder;
        }

        public async Task<IViewModel<ServiceDefinition>> Build(ServiceDefinition model)
        {
            var department = await departmentsStore.CachedGetByIdAsync(model.DepartmentId);
            var departmentViewModel = await departmentViewModelBuilder.Build(department);
            var audienceViewModels = new List<ServiceAudienceViewModel>();
            foreach (var serviceAudience in model.Audience)
            {
                var audienceViewModel = await serviceAudienceViewModelBuilder.Build(serviceAudience);
                audienceViewModels.Add((ServiceAudienceViewModel) audienceViewModel);
            }
            return new ServiceViewModel(model)
            {
                Department = (DepartmentViewModel) departmentViewModel,
                AudienceViewModels = audienceViewModels
            };
        }
    }
}
