using System.Collections.Generic;
using JanKIS.API.Models;

namespace JanKIS.API.ViewModels
{
    public class StockStateViewModel : StockState, IViewModel<StockState>
    {
        public StockStateViewModel(StockState model)
            : base(
                model.StockId,
                model.IsOrderable,
                model.IsUnlimitedOrderable,
                model.OrderableBy,
                model.Quantity)
        {
        }

        public StockViewModel Stock { get; set; }
        public List<ServiceAudienceViewModel> Audience { get; set; }
    }
}
