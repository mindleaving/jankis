using System.Threading.Tasks;
using HealthModels;
using JanKIS.API.Storage;
using JanKIS.API.ViewModels;

namespace JanKIS.API.Workflow.ViewModelBuilders
{
    public class DepartmentViewModelBuilder : IViewModelBuilder<Department>
    {
        private readonly ICachedReadonlyStore<Department> departmentsStore;

        public DepartmentViewModelBuilder(ICachedReadonlyStore<Department> departmentsStore)
        {
            this.departmentsStore = departmentsStore;
        }

        public async Task<IViewModel<Department>> Build(Department model)
        {
            IViewModel<Department> parentDepartmentViewModel = null;
            if (model.ParentDepartmentId != null)
            {
                var parentDepartment = await departmentsStore.CachedGetByIdAsync(model.ParentDepartmentId);
                parentDepartmentViewModel = await Build(parentDepartment);
            }
            return new DepartmentViewModel(model)
            {
                ParentDepartment = (DepartmentViewModel) parentDepartmentViewModel
            };
        }
    }
}