using System.Threading.Tasks;
using HealthModels;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using JanKIS.API.ViewModels;

namespace JanKIS.API.Workflow.ViewModelBuilders
{
    public class LocationViewModelBuilder : IViewModelBuilder<LocationReference>
    {
        private readonly ICachedReadonlyStore<Department> departmentsStore;
        private readonly IViewModelBuilder<Department> departmentViewModelBuilder;
        private readonly IReadonlyStore<Room> roomsStore;

        public LocationViewModelBuilder(
            ICachedReadonlyStore<Department> departmentsStore,
            IViewModelBuilder<Department> departmentViewModelBuilder,
            IReadonlyStore<Room> roomsStore)
        {
            this.departmentsStore = departmentsStore;
            this.departmentViewModelBuilder = departmentViewModelBuilder;
            this.roomsStore = roomsStore;
        }

        public async Task<IViewModel<LocationReference>> Build(LocationReference model)
        {
            IViewModel<Department> departmentViewModel = null;
            Room room = null;
            if (model.Type == LocationType.Department)
            {
                var department = await departmentsStore.CachedGetByIdAsync(model.Id);
                departmentViewModel = await departmentViewModelBuilder.Build(department);
            }
            else if (model.Type == LocationType.Room)
            {
                room = await roomsStore.GetByIdAsync(model.Id);
            }
            return new LocationViewModel(model)
            {
                Department = (DepartmentViewModel) departmentViewModel,
                Room = room
            };
        }
    }
}
