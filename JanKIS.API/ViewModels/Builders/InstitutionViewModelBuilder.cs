using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JanKIS.API.Models;
using JanKIS.API.Storage;

namespace JanKIS.API.ViewModels.Builders
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

        public async Task<IViewModel<Institution>> Build(Institution model)
        {
            var rooms = await roomsStore.SearchAsync(x => model.RoomIds.Contains(x.Id));
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
    }
}
