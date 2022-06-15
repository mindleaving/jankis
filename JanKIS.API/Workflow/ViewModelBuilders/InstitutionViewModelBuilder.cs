using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HealthModels;
using HealthSharingPortal.API.Storage;
using HealthSharingPortal.API.ViewModels;
using HealthSharingPortal.API.Workflow.ViewModelBuilders;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using JanKIS.API.ViewModels;

namespace JanKIS.API.Workflow.ViewModelBuilders
{
    public class InstitutionViewModelBuilder : IViewModelBuilder<Institution>
    {
        private readonly ICachedReadonlyStore<Room> roomsStore;
        private readonly ICachedReadonlyStore<Department> departmentsStore;
        private readonly IViewModelBuilder<Department> departmentViewModelBuilder;

        public InstitutionViewModelBuilder(
            ICachedReadonlyStore<Room> roomsStore,
            ICachedReadonlyStore<Department> departmentsStore,
            IViewModelBuilder<Department> departmentViewModelBuilder)
        {
            this.roomsStore = roomsStore;
            this.departmentsStore = departmentsStore;
            this.departmentViewModelBuilder = departmentViewModelBuilder;
        }

        public async Task<IViewModel<Institution>> Build(Institution model, IViewModelBuilderOptions<Institution> options = null)
        {
            var rooms = await roomsStore.SearchAsync(x => x.InstitutionId == model.Id);
            var departments = await departmentsStore.SearchAsync(x => x.InstitutionId == model.Id);
            var departmentViewModels = new List<DepartmentViewModel>();
            foreach (var department in departments)
            {
                var departmentViewModel = await departmentViewModelBuilder.Build(department);
                departmentViewModels.Add((DepartmentViewModel) departmentViewModel);
            }
            return new InstitutionViewModel(model)
            {
                Departments = departmentViewModels.OrderBy(x => x.Name).ToList(),
                Rooms = rooms.OrderBy(x => x.Name).ToList()
            };
        }

        public Task<List<IViewModel<Institution>>> BatchBuild(
            List<Institution> models,
            IViewModelBuilderOptions<Institution> options = null)
        {
            throw new System.NotImplementedException();
        }
    }
}
