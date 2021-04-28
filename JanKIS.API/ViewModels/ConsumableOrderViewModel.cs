using System.Collections.Generic;
using JanKIS.API.Models;

namespace JanKIS.API.ViewModels
{
    public class ConsumableOrderViewModel : ConsumableOrder, IViewModel<ConsumableOrder>
    {
        public ConsumableOrderViewModel(ConsumableOrder model)
            : base(
                model.Id,
                model.ConsumableId,
                model.ConsumableName,
                model.Quantity,
                model.State,
                model.Note,
                model.Requester,
                model.PreferredSources,
                model.Timestamps)
        {
        }

        public Consumable Consumable { get; set; }
        public List<StockViewModel> StockViewModels { get; set; }
        public AccountViewModel RequesterViewModel { get; set; }
    }
}
