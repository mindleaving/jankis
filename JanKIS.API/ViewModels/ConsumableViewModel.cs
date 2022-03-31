using System.Collections.Generic;
using HealthSharingPortal.API.ViewModels;
using JanKIS.API.Models;

namespace JanKIS.API.ViewModels
{
    public class ConsumableViewModel : Consumable, IViewModel<Consumable>
    {
        public ConsumableViewModel(Consumable model)
            : base(model.Id, model.Name)
        {
        }

        public List<StockStateViewModel> StockStateViewModels { get; set; }
    }
}
