using System.Collections.Generic;
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

        public async Task<IViewModel<Department>> Build(Department model, IViewModelBuilderOptions<Department> options = null)
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

        public Task<List<IViewModel<Department>>> BatchBuild(
            List<Department> models,
            IViewModelBuilderOptions<Department> options = null)
        {
            throw new System.NotImplementedException();
        }
    }
}