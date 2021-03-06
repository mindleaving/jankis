using System.Collections.Generic;
using System.Threading.Tasks;
using JanKIS.API.Models;

namespace JanKIS.API.ViewModels.Builders
{
    public class ConsumableViewModelBuilder : IViewModelBuilder<Consumable>
    {
        private readonly IViewModelBuilder<StockState> stockStateViewModelBuilder;

        public ConsumableViewModelBuilder(IViewModelBuilder<StockState> stockStateViewModelBuilder)
        {
            this.stockStateViewModelBuilder = stockStateViewModelBuilder;
        }

        public async Task<IViewModel<Consumable>> Build(Consumable model)
        {
            var stockStateViewModels = new List<StockStateViewModel>();
            foreach (var stockState in model.StockStates)
            {
                var stockStateViewModel = await stockStateViewModelBuilder.Build(stockState);
                stockStateViewModels.Add((StockStateViewModel) stockStateViewModel);
            }
            return new ConsumableViewModel(model)
            {
                StockStateViewModels = stockStateViewModels
            };
        }
    }
}
