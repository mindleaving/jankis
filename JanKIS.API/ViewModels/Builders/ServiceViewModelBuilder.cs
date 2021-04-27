using System.Threading.Tasks;
using JanKIS.API.Models;
using JanKIS.API.Storage;

namespace JanKIS.API.ViewModels.Builders
{
    public class ServiceViewModelBuilder : IViewModelBuilder<ServiceDefinition>
    {
        private readonly ICachedReadonlyStore<Department> departmentsStore;
        private readonly IViewModelBuilder<Department> departmentViewModelBuilder;

        public ServiceViewModelBuilder(
            ICachedReadonlyStore<Department> departmentsStore,
            IViewModelBuilder<Department> departmentViewModelBuilder)
        {
            this.departmentsStore = departmentsStore;
            this.departmentViewModelBuilder = departmentViewModelBuilder;
        }

        public async Task<IViewModel<ServiceDefinition>> Build(ServiceDefinition model)
        {
            var department = await departmentsStore.CachedGetByIdAsync(model.DepartmentId);
            var departmentViewModel = await departmentViewModelBuilder.Build(department);
            return new ServiceViewModel(model)
            {
                Department = (DepartmentViewModel) departmentViewModel
            };
        }
    }
}
