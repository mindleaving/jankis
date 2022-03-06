﻿using System.Threading.Tasks;
using HealthModels;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using JanKIS.API.ViewModels;

namespace JanKIS.API.Workflow.ViewModelBuilders
{
    public class StockViewModelBuilder : IViewModelBuilder<Stock>
    {
        private readonly IReadonlyStore<Department> departmentsStore;
        private readonly IViewModelBuilder<Department> departmentViewModelBuilder;
        private readonly IViewModelBuilder<LocationReference> locationViewModelBuilder;

        public StockViewModelBuilder(
            IReadonlyStore<Department> departmentsStore,
            IViewModelBuilder<Department> departmentViewModelBuilder,
            IViewModelBuilder<LocationReference> locationViewModelBuilder)
        {
            this.departmentsStore = departmentsStore;
            this.departmentViewModelBuilder = departmentViewModelBuilder;
            this.locationViewModelBuilder = locationViewModelBuilder;
        }

        public async Task<IViewModel<Stock>> Build(Stock model)
        {
            var department = await departmentsStore.GetByIdAsync(model.DepartmentId);
            var departmentViewModel = await departmentViewModelBuilder.Build(department);
            var locationViewModel = await locationViewModelBuilder.Build(model.Location);
            return new StockViewModel(model)
            {
                Department = (DepartmentViewModel) departmentViewModel,
                LocationViewModel = (LocationViewModel) locationViewModel
            };
        }
    }
}