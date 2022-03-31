using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using JanKIS.API.Models;
using JanKIS.API.Storage;
using JanKIS.API.ViewModels;

namespace JanKIS.API.Workflow.ViewModelBuilders
{
    public class AttachedEquipmentViewModelBuilder : IViewModelBuilder<AttachedEquipment>
    {
        private readonly ICachedReadonlyStore<Consumable> consumablesStore;
        private readonly ICachedReadonlyStore<Resource> resourcesStore;

        public AttachedEquipmentViewModelBuilder(
            ICachedReadonlyStore<Consumable> consumablesStore,
            ICachedReadonlyStore<Resource> resourcesStore)
        {
            this.consumablesStore = consumablesStore;
            this.resourcesStore = resourcesStore;
        }

        public async Task<IViewModel<AttachedEquipment>> Build(AttachedEquipment model, IViewModelBuilderOptions<AttachedEquipment> options = null)
        {
            var materialViewModels = new List<MaterialViewModel>();
            foreach (var materialReference in model.Materials)
            {
                switch (materialReference.Type)
                {
                    case MaterialType.Consumable:
                        var consumable = await consumablesStore.CachedGetByIdAsync(materialReference.Id);
                        if(consumable != null)
                            materialViewModels.Add(new MaterialViewModel(consumable));
                        break;
                    case MaterialType.Resource:
                        var resource = await resourcesStore.CachedGetByIdAsync(materialReference.Id);
                        if(resource != null)
                            materialViewModels.Add(new MaterialViewModel(resource));
                        break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }
            return new AttachedEquipmentViewModel(model)
            {
                MaterialViewModels = materialViewModels
            };
        }

        public Task<List<IViewModel<AttachedEquipment>>> BatchBuild(
            List<AttachedEquipment> models,
            IViewModelBuilderOptions<AttachedEquipment> options = null)
        {
            throw new NotImplementedException();
        }
    }
}
